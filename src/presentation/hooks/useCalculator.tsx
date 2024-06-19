import { useEffect, useRef, useState } from "react"

enum Operator{
    add = '+',
    subtract = '-',
    multiply = '×',
    divide = '÷',
}


export const useCalculator = () => {

    const [formula, setFormula] = useState('');
    const [subRes, setSubRes] = useState('');

    const[number, setNumber] = useState('0');

    const lastOperation = useRef<Operator>();

    useEffect(() => {
        if(lastOperation.current){
            const firstFormulaPart = formula.split(' ').at(0);
            setFormula(`${firstFormulaPart} ${lastOperation.current} ${number}`)
        } else{
            setFormula(number);
        }
    }, [number]);
    
    useEffect(() => {
        if(lastOperation.current){
            const subRes = calculateSubResult();
            setSubRes(`${subRes}`)
        } else{
            setSubRes('');
        }
    }, [formula]);




    const clean = () => {
        setNumber('0');
        setSubRes('0');
        lastOperation.current=undefined;
        setFormula('');
    }

    const deleteOperation = () => {
        if(number.length===1 || (number.length===2 && number.includes('-')))
            return setNumber('0');
        return setNumber(number.slice(0,-1));
    }

    const toggleSign = () => {
        if (number.includes('-')){
            return setNumber(number.replace('-',''));
        }
        setNumber('-'+number);
    }

    const buildNumber = (numberString: string) => {
        if (number.includes('.') && numberString === '.') return;
        if (number.startsWith('0') || number.startsWith('-0')){
            if (numberString==='.'){
                return setNumber(number+numberString);
            }
            if(numberString==='0' && number.includes('.')){
                return setNumber(number+numberString);
            }
            if(numberString !=='0' && !number.includes('.')){
                return setNumber(number.replace('0',numberString));
            }
            if(numberString ==='0' && !number.includes('.')){
                return;
            }

            return setNumber(number+numberString);
        }
        setNumber(number+numberString)
    }


    const divideOperation= () => {
        if(subRes!== '' && number!== '0') setFormula(subRes);
        lastOperation.current = Operator.divide;
        setNumber('0');
    }

    const multiplyOperation= () => {
        if(subRes!== '' && number!== '0') setFormula(subRes);
        lastOperation.current = Operator.multiply;
        setNumber('0');
    }

    const substractOperation= () => {
        if(subRes!== '' && number!== '0') setFormula(subRes);
        lastOperation.current = Operator.subtract;
        setNumber('0');
    }

    const addOperation= () => {
        if(subRes!== '' && number!== '0') setFormula(subRes);
        lastOperation.current = Operator.add;
        setNumber('0');
    }


    const calculateResult=()=>{
        const result = calculateSubResult();
        setNumber(`${result}`);

        lastOperation.current = undefined;
        setSubRes('');
    }

const calculateSubResult=(): number => {
    
    const [firstValue, operation, secondValue] = formula.split(' ');

    const num1 = Number(firstValue);
    const num2 = Number(secondValue);

    if(isNaN(num2)) return num1;

        switch(lastOperation.current){
            case Operator.add:
                return num1 + num2;
                break;
            case Operator.subtract:
                return num1 - num2;
                break;
            case Operator.multiply:
                return num1 * num2;
                break;
            case Operator.divide:
                return num1 / num2;
                break;
            default:
                throw new Error('Operation not implemented')
        }
}

  return {
    //Properties
    number,
    formula,
    subRes,

    //Methods
    buildNumber,
    toggleSign,
    clean,
    deleteOperation,
    divideOperation,
    multiplyOperation,
    substractOperation,
    addOperation,
    calculateResult,
    calculateSubResult

  }
}
