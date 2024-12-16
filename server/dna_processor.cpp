#include <iostream>
#include <string>

using namespace std;

string processDna(string dna) {
    if (!dna.empty()) {
        dna[dna.length() - 1] = 'A';
    }
    return dna;
}

int main() {
    string dna;
    getline(cin, dna); 
    string processedDna = processDna(dna);
    cout << processedDna << endl; 
    return 0;
}
