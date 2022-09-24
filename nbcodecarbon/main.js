define(["base/js/namespace", "base/js/events"], function (Jupyter, events) {
  let start_codecarbon = function () {
    Jupyter.notebook.kernel.execute(
      "from nbcodecarbon import tracker; tracker.start()"
    );
    Jupyter.notebook.kernel.execute(
      "from nbcodecarbon import save_thread; save_thread.start()"
    );
  };

  let start_extension = function () {
    Jupyter.notebook.events.on("kernel_ready.Kernel", (e) => {
      start_codecarbon();
    });
  };

  // Run on start
  function load_ipython_extension() {
    start_extension();
  }
  return {
    load_ipython_extension: load_ipython_extension,
    load_jupyter_extension: load_ipython_extension,
  };
});
