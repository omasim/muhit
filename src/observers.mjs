// Observer failures are application diagnostics, never persistence failures.
export function notifyObserver(options, name, value) {
  const report = (error) => {
    try {
      if (options.onObserverError)
        Promise.resolve(options.onObserverError(error, name)).catch((e) =>
          console.error("Muhit observer error handler failed", e),
        );
      else console.error("Muhit observer failed: " + name, error);
    } catch (e) {
      console.error("Muhit observer error handler failed", e);
    }
  };
  try {
    Promise.resolve(options[name]?.(value)).catch(report);
  } catch (error) {
    report(error);
  }
}
