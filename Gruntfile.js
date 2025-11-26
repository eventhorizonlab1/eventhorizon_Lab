module.exports = function(grunt) {
  // Configuration vide pour l'instant
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  });

  // Tâche par défaut qui ne fait rien mais dit que tout va bien
  grunt.registerTask('default', []);
};
