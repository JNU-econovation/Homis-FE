// import sym1 from '../icons/SymbolIcons/sym1.png';
// import sym2 from '../icons/SymbolIcons/sym2.png';
// import sym3 from '../icons/SymbolIcons/sym3.png';
// import sym4 from '../icons/SymbolIcons/sym4.png';
// import sym5 from '../icons/SymbolIcons/sym5.png';
// import sym6 from '../icons/SymbolIcons/sym6.png';
// import sym7 from '../icons/SymbolIcons/sym7.png';
// import sym8 from '../icons/SymbolIcons/sym8.png';
// import sym9 from '../icons/SymbolIcons/sym9.png';
// import sym10 from '../icons/SymbolIcons/sym10.png';
// import sym11 from '../icons/SymbolIcons/sym11.png';
// import sym12 from '../icons/SymbolIcons/sym12.png';
// import sym13 from '../icons/SymbolIcons/sym13.png';
// import sym14 from '../icons/SymbolIcons/sym14.png';
// import sym15 from '../icons/SymbolIcons/sym15.png';
// import sym16 from '../icons/SymbolIcons/sym16.png';
// import sym17 from '../icons/SymbolIcons/sym17.png';

export const SYMBOL_DATA = [];

const NUM_OF_SYMBOLS = 17;
for (let i = 1; i <= NUM_OF_SYMBOLS; i++) {
    SYMBOL_DATA.push({
        id: `sym${i}`,
        src: `/icons/SymbolIcons/sym${i}.png`
    })
}