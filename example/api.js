import Creator from '../src/Creator';

const ins = new Creator({
    verbose: true
});
ins.create('css/**/*.scss').then(() => {
    
});
ins.watch();