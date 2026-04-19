// Quick test script for the palindrome checker
// Run with: npx tsx test_palindrome.ts

import { palindromeChecker } from './src/data/presets'
import { initializeSingle, stepSingle } from './src/engine/simulator'

const testCases = [
    { input: '0110', expected: 'accept', desc: 'even palindrome' },
    { input: '0111', expected: 'reject', desc: 'NOT palindrome' },
    { input: '1010', expected: 'reject', desc: 'NOT palindrome' },
    { input: '11',   expected: 'accept', desc: 'even palindrome' },
    { input: '00',   expected: 'accept', desc: 'even palindrome' },
    { input: '01',   expected: 'reject', desc: 'NOT palindrome' },
    { input: '10',   expected: 'reject', desc: 'NOT palindrome' },
    { input: '0',    expected: 'accept', desc: 'single char palindrome' },
    { input: '1',    expected: 'accept', desc: 'single char palindrome' },
    { input: '010',  expected: 'accept', desc: 'odd palindrome' },
    { input: '101',  expected: 'accept', desc: 'odd palindrome' },
    { input: '011',  expected: 'reject', desc: 'NOT palindrome' },
    { input: '0100', expected: 'reject', desc: 'NOT palindrome' },
    { input: '1001', expected: 'accept', desc: 'even palindrome' },
    { input: '010010', expected: 'accept', desc: 'even palindrome (6 chars)' },
    { input: '01010', expected: 'accept', desc: 'odd palindrome (5 chars)' },
    { input: '01011', expected: 'reject', desc: 'NOT palindrome' },
]

let passed = 0
let failed = 0

for (const tc of testCases) {
    let snap = initializeSingle(palindromeChecker, tc.input)
    let steps = 0
    const maxSteps = 500

    while (!snap.halted && steps < maxSteps) {
        snap = stepSingle(palindromeChecker, snap)
        steps++
    }

    const result = steps >= maxSteps ? 'INFINITE LOOP' : snap.result
    const ok = result === tc.expected
    const icon = ok ? '✓' : '✗'
    
    if (!ok) {
        console.log(`${icon} FAIL: "${tc.input}" → ${result} (expected ${tc.expected}) [${tc.desc}] in ${steps} steps`)
        failed++
    } else {
        console.log(`${icon} PASS: "${tc.input}" → ${result} [${tc.desc}] in ${steps} steps`)
        passed++
    }
}

console.log(`\n${passed} passed, ${failed} failed out of ${testCases.length} tests`)
