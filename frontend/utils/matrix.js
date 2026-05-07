export function sumDiagonals(matrix) {
    let sum = 0;
    const n = matrix.length;
    for (let i = 0; i < n; i++) {
        sum += matrix[i][i];
        sum += matrix[i][n - 1 - i];
    }
    if (n % 2 === 1) {
        const mid = Math.floor(n / 2);
        sum -= matrix[mid][mid];
    }
    return sum;
}
