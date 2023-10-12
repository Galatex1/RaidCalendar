import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.tsx',
    ],

    theme: {
        screens: {
            '2xl': { 'max': '1439px' },      //From 0 to 1439
            'xl': { 'max': '1335px' },      //From 0 to 1335
            'lg': { 'max': '1279px' },      //From 0 to 1279
            'mob': { 'max': '1149px' },      //From 0 to 1149
            'md': { 'max': '1023px' },       //From 0 to 1023 
            'sm': { 'max': '799px' },        //From 0 to 799
            'xs': { 'max': '639px' },        //From 0 to 639
            '2xs': { 'max': '320px' },       //From 0 to 320
            'nMob': '1150px',             //Over 1150px
            '3xl': '1441px',              //Over 1441
            '4xl': '1920px',              //Over 1920
            '5xl': '2500px',              //Over 2500
            '6xl': '3400px',              //Over 3400
        },
        spacing:
        {
            '0': '0px',
            ...(Array(55).fill(0).reduce((p, _, i) => ({ ...p, [`${i + 1}px`]: `${i + 1}px` }), {})),
            '64px': '64px',
            '75px': '75px',
            '80px': '80px',
            '100px': '100px',
            '105px': '105px',
            '110px': '110px',
            '115px': '115px',
            '120px': '120px',
            '125px': '125px',
            '135px': '135px',
            '150px': '150px',
            '225px': '225px',
            '250px': '250px',
            '300px': '300px',
            '320px': '320px',
            '530px': '530px',
            '580px': '580px',
            '1/2': '50%',
            '1/3': '33.33%',
            '2/3': '66.66%',
            '1/4': '25%',
            '3/4': '75%',
            '1/5': '20%',
            '2/5': '40%',
            '3/5': '60%',
            '4/5': '80%',
            'full': '100%',
            '50vh': '50vh',
            '80vh': '80vh',
            '90vh': '90vh',
            'screen-no-header': 'calc(100vh - 68px)',
        },
        borderRadius: {
            '0': '0',
            'xs': '1px',
            'sm': '2px',
            'DEFAULT': '4px',
            'md': '8px',
            'lg': '12px',
            'xl': '16px',
            '2xl': '20px',
            '3xl': '24px',
            'full': '99999px',
            '1/3': '33.33%'
        },
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                app: {
                    input: {
                        border: {
                            DEFAULT: '#444444',
                            dark: '#222222',
                            light: '#999999',
                        },
                        primary: '#5CB64F',
                        error: {
                            DEFAULT: '#C82A58',
                            dark: '#7b1936',
                        },
                        success: {
                            DEFAULT: '#5CB64F',
                        },
                        placeholder: '#666666'
                    },
                    button: {
                        DEFAULT: '#0f172a',
                        dark: '#428338', 
                        light: '#80ff6e', 
                    }
                }
            }
        },
    },

    plugins: [],
};