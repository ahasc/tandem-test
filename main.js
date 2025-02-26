const { createReadStream, writeFileSync, readFileSync } = require('fs');
const readline = require('readline');
const Handlebars = require('handlebars')

async function readFileAndBuildChunks(path) {
    const chunks = []

    return new Promise((resolve, reject) => {
        let currentSessionId = ''
        let currentSession = []
    
        const reader = readline.createInterface({
            input: createReadStream(path),
            crlfDelay: Infinity,
        });

        reader.on('eerror', (error) => {
            reject(error)
        })
        reader.on('line', (line) => {
            const trace = JSON.parse(line)
            if (currentSessionId !== '' && currentSessionId !== trace.session_id) {
                chunks.push(currentSession)
                currentSession = []
            }
            currentSessionId = trace.session_id
            currentSession.push(trace)
        });
        reader.on('close', () => {
            resolve(chunks)
        });
    })
}

async function main() {
    const sessions = await readFileAndBuildChunks('./sessions.json')
    const pathOccurences = {}
    const errors = []

    for (const session of sessions) {
        for (const trace of session) {
            pathOccurences[trace.path] = (pathOccurences[trace.path] || 0) + 1
            
            if (trace.css === 'div.error-message') {
                errors.push(trace)
            }
        }
    }

    const top10Paths = Object.entries(pathOccurences).sort((a, b) => b[1] - a[1]).slice(0, 10)

    const templateSource = readFileSync('report.template.hbs', 'utf8')
    const template = Handlebars.compile(templateSource)

    const htmlOutput = template({
        topPages: top10Paths,
        anomalies: errors
    })

    writeFileSync('report.html', htmlOutput)
}

main()