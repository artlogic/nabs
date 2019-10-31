// look for missing dependencies
function checkDependencies(tasks, names) {
  const taskNames = new Set(names);

  tasks.forEach((task) => {
    task.dependencies.forEach((dependency) => {
      if (!taskNames.has(dependency)) {
        throw new Error(`Task ${task} has non-existent dependency: ${dependency}`);
      }
    });
  });
}

export default checkDependencies;
