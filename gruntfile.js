module.exports = function (grunt) {
    grunt.initConfig({
        pkgFile: 'package.json',
        clean: ['build'],
        babel: {
            options: {
                sourceMap: false
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: './lib',
                    src: ['**/*.js'],
                    dest: 'build',
                    ext: '.js'
                }]
            }
        },
        copy: {
            app: {
                expand: true,
                cwd: 'lib/app',
                src: 'public/**',
                dest: 'build/app/'
            }
        },
        watch: {
            dist: {
                files: ['./lib/**/*'],
                tasks: ['babel:dist', 'copy:app']
            }
        },
        eslint: {
            target: [
                'index.js',
                'lib/**/*.js'
            ]
        },
        contributors: {
            options: {
                commitMessage: 'update contributors'
            }
        },
        bump: {
            options: {
                commitMessage: 'v%VERSION%',
                pushTo: 'upstream'
            }
        }
    })

    require('load-grunt-tasks')(grunt)
    grunt.registerTask('default', ['build'])
    grunt.registerTask('build', 'Build wdio-visualization-service', function () {
        grunt.task.run([
            'eslint',
            'clean',
            'babel',
            'copy'
        ])
    })
    grunt.registerTask('release', 'Bump and tag version', function (type) {
        grunt.task.run([
            'build',
            'contributors',
            'bump:' + (type || 'patch')
        ])
    })
}
