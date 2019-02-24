module.exports = {
    apps: [
        {
            name: 'parser',
            script: 'parser-proc.js',
            // exec_mode: 'cluster',
            // instances: 3,
            args: [
                "--no-pmx"
            ]
        },
        {
            name: 'persistence',
            script: 'persistence-proc.js',
            // exec_mode: 'cluster',
            // instances: 2
            // node_args: [
            //     "--prof"
            // ]
        },
        {
            name: 'crawler',
            script: 'crawler-proc.js',
        },
    ]
};
