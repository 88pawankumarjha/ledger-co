const fs = require("fs")

const filename = process.argv[2]

fs.readFile(filename, "utf8", (err, data) => {
    if (err) throw err
    const inputLines = data.toString().split("\n")
    for (inputLine of inputLines) processLine(inputLine)
})

const loans = [];
const payments = [];
const balance = [];

const processLine = (inputLine) => {
    const inputType = inputLine.split(' ')[0]
    switch (inputType) {
        case 'LOAN':
            processLoan(inputLine)
            break;
        case 'PAYMENT':
            processPayment(inputLine)
            break;
        case 'BALANCE':
            processBalance(inputLine)
            break;
        default:
            console.log(`Sorry, invalid input type ${inputType}.`);
    }
}

const processLoan = (inputLine) => {
    // const [loan, bank_name, borrower_name, principal, no_of_years, rate_of_interest] = inputLine.split(" ")
    loans.push(inputLine)
}

const processPayment = (inputLine) => {
    // const [payment, bank_name, borrower_name, lump_sum_amount, emi_no] = inputLine.split(" ")
    payments.push(inputLine)
}

const processBalance = (inputLine) => {
    const [balance, bank_name, borrower_name, emi_no] = inputLine.split(" ");
    const [loan, bank_name_loan, borrower_name_loan, principal, no_of_years, rate_of_interest] = getLoansByBorrowerName(borrower_name).split(" ");

    const interest = (principal * no_of_years * rate_of_interest) / 100;
    const amount = parseInt(interest) + parseInt(principal);


    const total_EMI = no_of_years * 12;
    const no_of_emis_left = total_EMI - emi_no;
    // const emi = principal * rate_of_interest * 
    //         ((1 + parseInt(rate_of_interest)) * (parseInt(no_of_years)*12))/
    //         ((1 + parseInt(rate_of_interest)) * (parseInt(no_of_years)*12) - 1)
    // const amount_paid = emi_no * emi
    console.log(principal)


    
    // const paid_EMI = (loans[name_b]['P']*loans[name_b]['N']*loans[name_b]['R']+
    //             loans[name_b]['P'])*int(EMI)/(loans[name_b]['N']*12)
    // const left_EMI = loans[name_b]['N']*12 - int(EMI)
}

const getLoansByBorrowerName = (borrower_name) => {
    let identifiedLoan = ""
    loans.some(v => { v.includes(borrower_name) && (identifiedLoan = v) });
    return identifiedLoan;
}

const getPaymentsByBorrowerName = (borrower_name) => {
    let identifiedPayments = [];
    payments.some(v => { v.includes(borrower_name) && (identifiedPayments.push(v)) });
    return identifiedPayments;
}
