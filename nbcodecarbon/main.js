define(["base/js/namespace", "base/js/events"], function (Jupyter, events) {
  let start_codecarbon = function () {
    Jupyter.notebook.kernel.execute(
      "from nbcodecarbon import tracker; tracker.start()"
    );
    Jupyter.notebook.kernel.execute(
      "from nbcodecarbon import save_thread; save_thread.start()"
    );
  };

  let save_content = function () {
    if (Jupyter.notebook.kernel) {
      console.log("READY 1");
      start_codecarbon();
    } else {
      console.log("NOT READY 2");
      Jupyter.notebook.events.one("kernel_ready.Kernel", (e) => {
        console.log("READY 2");
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
      save_content();
    }, 5000);
  };

  // Run on start
  function load_ipython_extension() {
    // Add a default cell if there are no cells
    if (Jupyter.notebook.get_cells().length === 1) {
      // init_nb();
    }
    save_content();
    // planetJupyterButton();
    // save_auto();
  }
  return {
    load_ipython_extension: load_ipython_extension,
  };
});
