module.exports = {
    apps: [
        {
            name: 'crawler',
            script: 'crawler-proc.js',
            node_args: [
                "--inspect-brk=7001"
            ]
        },
        {
            name: 'parser',
            script: 'parser-proc.js',
            args: [
                "--no-pmx"
            ],
            node_args: [
                "--inspect-brk=7002"
            ]
        },
        {
            name: 'persistence',
            script: 'persistence-proc.js',
            node_args: [
                "--inspect-brk=7003"
            ]
        }
    ]
};
