define(["base/js/namespace", "base/js/events"], function (Jupyter, events) {
  let start_codecarbon = function () {
    Jupyter.notebook.kernel.execute(
      "from nbcodecarbon import tracker; tracker.start()"
    );
    Jupyter.notebook.kernel.execute(
      "from nbcodecarbon import save_thread; save_thread.start()"
    );
    console.log("codecarbon started");
  };

  let start_extension = function () {
    console.log("Starting extension...");
    if (Jupyter.notebook.kernel) {
      start_codecarbon();
    } else {
      Jupyter.notebook.events.one("kernel_ready.Kernel", (e) => {
        start_codecarbon();
      });
    }
  };

  // Add Toolbar button
  let planetJupyterButton = function () {
    console.log("run");
    Jupyter.toolbar.add_buttons_group([
      Jupyter.keyboard_manager.actions.register(
        {
          help: "Add planet jupyter cell",
          icon: "fa-paper-plane",
          handler: save_content,
        },
        "addplanetjupyter-cell",
        "Planet Jupyter"
      ),
    ]);
  };

  var save_auto = function () {
    setInterval(function () {
      console.log("Save content 2 !!");
      start_extension();
    }, 5000);
  };

  // Run on start
  function load_ipython_extension() {
    // Add a default cell if there are no cells
    if (Jupyter.notebook.get_cells().length === 1) {
      // init_nb();
    }
    start_extension();
    // planetJupyterButton();
    // save_auto();
  }
  return {
    load_ipython_extension: load_ipython_extension,
  };
});
