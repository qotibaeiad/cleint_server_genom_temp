const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');  
const app = express();
const port = 3001;

app.use(cors());  
app.use(express.json());  

app.post('/process-dna', (req, res) => {
    const dnaSequence = req.body.dnaSequence;

    if (!dnaSequence) {
        return res.status(400).send('DNA sequence is required');
    }

    console.log('Received DNA sequence:', dnaSequence);

    const executablePath = './dna_processor.exe';  

    const process = spawn(executablePath);

    process.stdin.write(dnaSequence + '\n');
    process.stdin.end();  

    let output = '';
    process.stdout.on('data', (data) => {
        output += data.toString();
    });

    let errorOutput = '';
    process.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });

    process.on('close', (code) => {
        if (code !== 0) {
            console.error(`Error executing C++ program: ${errorOutput}`);
            return res.status(500).send('Error processing DNA sequence');
        }

        console.log('Processed DNA:', output.trim());
        return res.json({ processedDna: output.trim() });  
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
