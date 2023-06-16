module Jekyll
  class DataPage < Page
    # - `dir_expr` is the modified argument
    # - `dir_expr` is an expression for generating the output directory
    def initialize(site, base, index_files, dir, dir_expr, page_data_prefix, data, name, name_expr, title, title_expr, template, extension, debug)
      @site = site
      @base = base

      if debug
        puts "debug (datapage-gen) Record read:"
        puts ">> #{data}"

        puts "debug (datapage-gen) Configuration variables:"
        [:index_files, :dir, :dir_expr, :page_data_prefix, :name, :name_expr, :title, :title_expr, :template, :extension].each do |variable|
          puts ">> #{variable}: #{eval(variable.to_s)}"
        end
      end

      # @dir is the directory where we want to output the page
      # @name is the name of the page to generate
      # @name_expr is an expression for generating the name of the page
      #
      # the value of these variables changes according to whether we
      # want to generate named folders or not
      if name_expr
        record = data
        raw_filename = eval(name_expr)
        if raw_filename == nil
          puts "error (datapage-gen). name_expr '#{name_expr}' generated an empty value in record #{data}"
          return
        end
        puts "debug (datapage-gen). using name_expr: '#{raw_filename}' (sanitized) will be used as the filename" if debug
      else
        raw_filename = data[name]
        if raw_filename == nil
          puts "error (datapage-gen). empty value for field '#{name}' in record #{data}"
          return
        end
        puts "debug (datapage-gen). using name field: '#{raw_filename}' (sanitized) will be used as the filename" if debug
      end

      if title_expr
        record = data
        raw_title = eval(title_expr)
        if raw_title == nil
          puts "error (datapage-gen). title_expr '#{title_expr}' generated an empty value in record #{data}"
          return
        end
        puts "debug (datapage-gen). using title_expr: '#{raw_title}' will be used the page title" if debug
      else
        raw_title = data[title]
        if raw_title == nil
          raw_title = raw_filename # for backwards compatibility
          puts "debug (datapage-gen). empty title field: falling back to filename for the page title" if debug
        end
          puts "debug (datapage-gen). will use '#{raw_title}' as the page title" if debug
      end

      filename = sanitize_filename(raw_filename).to_s

      # Old option, without dir_expr
      # @dir = dir + (index_files ? "/" + filename + "/" : "")

      if dir_expr
        record = data
        raw_dir = eval(dir_expr)
        if raw_dir == nil
          puts "error (datapage-gen). raw_dir '#{raw_dir}' generated an empty value in record #{data}"
          return
        end
        @dir = raw_dir + (index_files ? "/" + filename + "/" : "")
        puts "debug (datapage-gen). using raw_dir: '#{raw_dir}' will be used the directory output" if debug
      else
        @dir = dir + (index_files ? "/" + filename + "/" : "")
      end

      @name = (index_files ? "index" : filename) + "." + extension.to_s

      self.process(@name)

      if @site.layouts[template].path.end_with? 'html'
        @path = @site.layouts[template].path.dup
      else
        @path = File.join(@site.layouts[template].path, @site.layouts[template].name)
      end

      base_path = @site.layouts[template].path
      base_path.slice! @site.layouts[template].name
      self.read_yaml(base_path, @site.layouts[template].name)

      self.data['title'] = raw_title

      # add all the information defined in _data for the current record to the
      # current page (so that we can access it with liquid tags)
      if page_data_prefix
        self.data[page_data_prefix] = data
      else
        if data.key?('name')
          data['_name'] = data['name']
        end
        self.data.merge!(data)
      end

    end
  end

  class JekyllDatapageGenerator < Generator
    safe true

    # the function =generate= loops over the =_config.yml/page_gen=
    # specification, determining what sets of pages have to be generated,
    # reading the data for each set and invoking the =DataPage=
    # constructor for each record found in the data

    def generate(site)
      # page_gen-dirs is a global option which determines whether we want to
      # generate index pages (name/index.html) or HTML files (name.html) for
      # all sets
      index_files = site.config['page_gen-dirs'] == true

      # data contains the specification of all the datasets for which we want
      # to generate individual pages (look at the README file for its documentation)
      data = site.config['page_gen']
      if data
        data.each do |data_spec|
          index_files_for_this_data = data_spec['index_files'] != nil ? data_spec['index_files'] : index_files
          template         = data_spec['template'] || data_spec['data']
          name             = data_spec['name']
          name_expr        = data_spec['name_expr']
          title            = data_spec['title']
          title_expr       = data_spec['title_expr']
          dir              = data_spec['dir'] || data_spec['data']
          dir_expr         = data_spec['dir_expr']
          extension        = data_spec['extension'] || "html"
          page_data_prefix = data_spec['page_data_prefix']
          debug            = data_spec['debug']

          if not site.layouts.key? template
            puts "error (datapage-gen). could not find template #{template}. Skipping dataset #{name}."
          else
            # records is the list of records for which we want to generate
            # individual pages
            records = nil

            data_spec['data'].split('.').each do |level|
              if records.nil?
                records = site.data[level]
              else
                records = records[level]
              end
            end
            if (records.kind_of?(Hash))
              records = records.values
            end

            # apply filtering conditions:
            # - filter requires the name of a boolean field
            # - filter_condition evals a ruby expression which can use =record= as argument
            records = records.select { |record| record[data_spec['filter']] } if data_spec['filter']
            records = records.select { |record| eval(data_spec['filter_condition']) } if data_spec['filter_condition']

            # we now have the list of all records for which we want to generate individual pages
            # iterate and call the constructor
            records.each do |record|
              site.pages << DataPage.new(site, site.source, index_files_for_this_data, dir, dir_expr, page_data_prefix, record, name, name_expr, title, title_expr, template, extension, debug)
            end
          end
        end
      end
    end
  end

  module DataPageLinkGenerator
    include Sanitizer

    # use it like this: {{input | datapage_url: dir}}
    # to generate a link to a data_page.
    #
    # the filter is smart enough to generate different link styles
    # according to the data_page-dirs directive ...
    #
    # ... however, the filter is not smart enough to support different
    # extensions for filenames.
    #
    # Thus, if you use the `extension` feature of this plugin, you
    # need to generate the links by hand
    def datapage_url(input, dir)
      extension = @context.registers[:site].config['page_gen-dirs'] ? '/' : '.html'
      "#{dir}/#{sanitize_filename(input)}#{extension}"
    end
  end

end

Liquid::Template.register_filter(Jekyll::DataPageLinkGenerator)
