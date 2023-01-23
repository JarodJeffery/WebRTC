import * as store from './store.js';

export const updatePersonalCode =(updatePersonalCode) =>{
    const personalCodeParagraph = document.getElementById('personal_code_paragraph');
    personalCodeParagraph.innerHTML = updatePersonalCode;
}