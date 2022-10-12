define(["base/js/namespace", "base/js/events"], function (Jupyter, events) {
  // function to execute Python code in jupyter kernel
  // if an error is catched then return it
  let execute_python = function (python) {
    return new Promise((resolve, reject) => {
      let callbacks = {
        iopub: {
          output: (data) => {
            if (data.msg_type == "error") {
              resolve(data.content.evalue);
            }
          },
        },
      };
      Jupyter.notebook.kernel.execute(`${python}`, callbacks);
    });
  };

  function log_out_if_error(r) {
    console.error(r);
  }

  let start_codecarbon = function () {
    // import init_tracker func
    execute_python("from nbcodecarbon import init_tracker").then((r) =>
      log_out_if_error(r)
    );

    // get conf
    let config = Jupyter.notebook.config;
    let conf = {};

    if (config.data.hasOwnProperty("nbcodecarbon")) {
      if (config.data.nbcodecarbon.hasOwnProperty("codecarbon_config")) {
        conf = config.data.nbcodecarbon.codecarbon_config;
      }
    }
    console.log("conf", conf);

    execute_python(
      'tracker, save_thread = init_tracker("""' + conf + '""")'
    ).then((r) => log_out_if_error(r));

    // rename tracker with current notebook name
    execute_python(
      "tracker._project_name = '" + Jupyter.notebook.notebook_name + "'"
    ).then((r) => log_out_if_error(r));

    // Start tracker
    execute_python("tracker.start()").then((r) => log_out_if_error(r));
    // start thread to save each N seconds
    execute_python("save_thread.start()").then((r) => log_out_if_error(r));
  };

  let start_extension = function () {
    // When notebook kernel is started
    Jupyter.notebook.events.on("kernel_ready.Kernel", (e) => {
      // then start extension
      start_codecarbon();
    });
  };

  let handler_flush_tracker = function () {
    // save tracker manually
    execute_python("tracker.flush()").then((r) => log_out_if_error(r));
  };

  // Run on start
  function load_ipython_extension() {
    start_extension();

    // define parameter to save manually tracker's output
    let action = {
      icon: "fa-leaf",
      help: "Save codecarbon tracker emissions details manually",
      help_index: "zz",
      handler: handler_flush_tracker,
    };
    let prefix = "nbcodecarbon";
    let action_name = "flush-tracker";

    // register action
    let flush_tracker_action = Jupyter.actions.register(
      action,
      action_name,
      prefix
    ); // returns 'nbcodecarbon:flush-tracker'

    // add action button to toolbar
    Jupyter.toolbar.add_buttons_group([flush_tracker_action]);
  }

  return {
    load_ipython_extension: load_ipython_extension,
    load_jupyter_extension: load_ipython_extension,
  };
});
