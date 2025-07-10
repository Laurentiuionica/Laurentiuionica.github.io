function esPrimo(n) {
    if (n < 2)  return false; 
    
    for (let i = 2; i < n; i++) {
        if (n % i === 0) return false; 
        
    }
    return true; 
}

const primos = [];
for (let i = 2; i <= 100; i++) {
    if (esPrimo(i)) {
        primos.push(i); 
    }
}

console.log("Números primos del 1 al 100:");
console.log(primos); 