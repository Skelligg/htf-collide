import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, Button, TextField, CircularProgress, Stack } from '@mui/material';

// Lightweight helper to load Pyodide from CDN (avoids adding an npm dependency)
async function loadPyodideFromCDN() {
    // @ts-ignore
    if (typeof (window as any).loadPyodide === 'function') {
        // @ts-ignore
        return await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/' });
    }

    return new Promise<any>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
        script.async = true;
        script.onload = async () => {
            try {
                // @ts-ignore
                const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/' });
                resolve(py);
            } catch (e) {
                reject(e);
            }
        };
        script.onerror = (e) => reject(e);
        document.head.appendChild(script);
    });
}

function indentCode(code: string, spaces = 4) {
    return code
        .split('\n')
        .map((line) => (line.trim() ? ' '.repeat(spaces) + line : ''))
        .join('\n');
}

export default function Problem3() {
    // FIXED: Hard-code the secret variable to 55 as requested.
    const secretValue = 55;

    return (
        <Box sx={{ minHeight: '80vh', pb: 6, color: '#fff' }}>
            <Box sx={{ maxWidth: 1100, margin: '0 auto', px: 3, pt: 6 }}>
                <Typography variant="h3" sx={{ mb: 1, fontWeight: 800 }}>
                    Brute Force Mission
                </Typography>
                <Typography sx={{ mb: 3, color: 'rgba(255,255,255,0.8)' }}>
                    A small embedded Python terminal lets you experiment. The runtime runs locally in your browser via Pyodide.
                    The mission secret is hardcoded as <code>{secretValue}</code> and available as the Python variable <code>SECRET</code>.
                </Typography>

                <Paper sx={{ p: 3, background: 'rgba(255,255,255,0.03)' }} elevation={6}>
                    <PythonTerminal secret={secretValue} />
                </Paper>
            </Box>
        </Box>
    );
}

function PythonTerminal({ secret }: { secret: number }) {
    const [pyodide, setPyodide] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Default code snippet with efficient early exit (if/break)
    const defaultCode = `# Example: Efficient brute-force using check_answer(i)
for i in range(1, 10001):
    if check_answer(i):
        print(f"Answer found! The value is: {i}")
        break
print("Loop finished (or answer found)")`;

    const [code, setCode] = useState<string>(defaultCode);

    const [output, setOutput] = useState<string>('');
    const [running, setRunning] = useState<boolean>(false);
    const mounted = useRef(true);

    // Quick-try input for a single guess (check before running)
    const [quickGuess, setQuickGuess] = useState<string>('');
    const [quickResult, setQuickResult] = useState<'idle' | 'correct' | 'wrong'>('idle');

    useEffect(() => {
        mounted.current = true;
        setLoading(true);
        loadPyodideFromCDN()
            .then((py) => {
                if (!mounted.current) return;
                setPyodide(py);
            })
            .catch((err) => {
                console.error('Failed to load Pyodide', err);
                setOutput('Failed to load Pyodide: ' + String(err));
            })
            .finally(() => mounted.current && setLoading(false));

        return () => {
            mounted.current = false;
        };
    }, []);

    const runCode = async () => {
        if (!pyodide || running) return;
        setRunning(true);
        setOutput('');
        try {
            // Inject secret (which is 55) into Pyodide globals
            try {
                pyodide.globals.set('SECRET', secret);
            } catch (e) {
                // fallback
                await pyodide.runPythonAsync(`SECRET = ${JSON.stringify(secret)}`);
            }

            // wrap user code with check_answer helper and safe IO capture, returning JSON
            const wrapper = `
import sys, io, json, traceback
_correct = False

def check_answer(n):
    global _correct
    # Return True only when n matches SECRET; do not return n (which is truthy for non-zero)
    if n == SECRET:
        _correct = True
        return True
    return False

_buffer = io.StringIO()
_old = sys.stdout
sys.stdout = _buffer
try:
${indentCode(code)}
except Exception as _e:
    traceback.print_exc()
finally:
    sys.stdout = _old
_output = _buffer.getvalue()
# produce JSON result
json.dumps({"correct": _correct, "output": _output})
`;

            const res = await pyodide.runPythonAsync(wrapper);
            // res should be a JSON string
            const jsonText = typeof res === 'string' ? res : String(res ?? '');
            let parsed: { correct: boolean; output: string } = { correct: false, output: jsonText };
            try {
                parsed = JSON.parse(jsonText);
            } catch (e) {
                // If parsing fails, fall back to raw output
                parsed = { correct: false, output: jsonText };
            }

            setOutput(parsed.output || '');
            if (parsed.correct) {
                // show success prompt
                // NOTE: Using a custom modal is preferred over alert() in production.
                alert('✅ Correct — your code found the secret number!');
            }
        } catch (err: any) {
            const errText = String(err || 'Unknown error');
            // If the special exception bubbled up (rare because we handled it), detect it
            if (errText.includes('__CORRECT__')) {
                // NOTE: Using a custom modal is preferred over alert() in production.
                alert('✅ Correct — your code found the secret number!');
                setOutput('Code executed successfully and found the secret.');
            } else {
                setOutput(errText);
            }
        } finally {
            setRunning(false);
        }
    };

    const quickTry = () => {
        const n = Number(quickGuess);
        if (!Number.isFinite(n) || n < 1 || n > 10000) {
            setQuickResult('wrong');
            return;
        }
        if (n === secret) {
            setQuickResult('correct');
            // NOTE: Using a custom modal is preferred over alert() in production.
            alert('✅ Correct — quick guess matched the secret!');
        } else {
            setQuickResult('wrong');
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Typography sx={{ fontWeight: 700 }}>Browser Python (Pyodide)</Typography>
                {loading && (
                    <Stack direction="row" spacing={1} alignItems="center">
                        <CircularProgress size={16} sx={{ color: 'white' }} />
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Loading runtime...</Typography>
                    </Stack>
                )}
                {!loading && !pyodide && <Typography sx={{ color: 'salmon' }}>Runtime unavailable</Typography>}

                <Box sx={{ ml: 'auto', display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                        size="small"
                        placeholder="Quick guess (1-10000)"
                        value={quickGuess}
                        onChange={(e) => {
                            setQuickGuess(e.target.value);
                            setQuickResult('idle');
                        }}
                        sx={{
                            width: 160,
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '4px',
                            '& .MuiInputBase-root': { color: '#fff' }
                        }}
                    />
                    <Button variant="outlined" onClick={quickTry} sx={{ borderRadius: '8px' }}>
                        Quick Try
                    </Button>
                    {quickResult === 'correct' && <Typography color="lightgreen">Correct ✅</Typography>}
                    {quickResult === 'wrong' && <Typography color="salmon">Wrong ❌</Typography>}
                </Box>
            </Stack>

            <TextField
                multiline
                minRows={8}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                sx={{
                    fontFamily: 'monospace',
                    background: 'rgba(0,0,0,0.4)',
                    borderRadius: '8px',
                    '& .MuiInputBase-input': { fontFamily: 'monospace', color: '#f0f0f0' }
                }}
                inputProps={{ spellCheck: 'false' }}
            />

            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" onClick={runCode} disabled={!pyodide || running} sx={{ borderRadius: '8px' }}>
                    {running ? 'Running…' : 'Run'}
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setCode(defaultCode); // Reset to the optimized default code
                        setOutput('');
                    }}
                    sx={{ borderRadius: '8px' }}
                >
                    Reset Code
                </Button>
                <Button
                    variant="text"
                    onClick={() => setOutput('')}
                    sx={{ color: 'rgba(255,255,255,0.75)', ml: 'auto' }}
                >
                    Clear Output
                </Button>
            </Box>

            <Paper
                variant="outlined"
                sx={{
                    background: 'rgba(0,0,0,0.6)',
                    color: '#e6f7ff',
                    p: 2,
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}
            >
                {output || <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>Program output will appear here</Typography>}
            </Paper>
        </Box>
    );
}