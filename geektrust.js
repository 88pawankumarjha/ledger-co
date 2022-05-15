const fs = require('fs');

const filename = process.argv[2];

fs.readFile(filename, 'utf8', (err, data) => {
  if (err) throw err;
  const inputLines = data.toString().split('\n');
  for (inputLine of inputLines) processLine(inputLine);
});

const loans = [];
const payments = [];

const processLine = (inputLine) => {
  const inputType = inputLine.split(' ')[0];
  switch (inputType) {
    case 'LOAN':
      processLoan(inputLine);
      break;
    case 'PAYMENT':
      processPayment(inputLine);
      break;
    case 'BALANCE':
      processBalance(inputLine);
      break;
    default:
      console.log(`Sorry, invalid input type ${inputType}.`);
  }
};

const processLoan = (inputLine) => {
  loans.push(inputLine);
};

const processPayment = (inputLine) => {
  payments.push(inputLine);
};

const getLoansByBorrowerName = (brn) => {
  let identifiedLoan = '';
  loans.some((v) => {
    v.includes(brn) && (identifiedLoan = v);
  });
  return identifiedLoan;
};

const getpaymByBorrName = (brn) => {
  let identifiedPayments = [];
  payments.some((v) => {
    v.includes(brn) && identifiedPayments.push(v);
  });
  return identifiedPayments;
};

const beforePayment = (tot_emi, emi_no, amt, bn, brn) => {
  const no_of_emis_left = tot_emi - emi_no;
  const emi = Math.ceil(amt / tot_emi);
  const amt_paid = Math.min(amt, emi * emi_no);
  printSolution(bn, brn, amt_paid, no_of_emis_left);
};

const afterSinglePayment = (emi, pay_e_n, amt, lamt, emi_no, bn, brn) => {
  const amt_paid_before_payment = emi * pay_e_n;
  const reduced_amt_to_be_paid =
    amt - (amt_paid_before_payment + parseInt(lamt));
  let upd_emi_left = Math.ceil(reduced_amt_to_be_paid / emi);
  const amt_paid =
    amt_paid_before_payment + parseInt(lamt) + emi * (emi_no - pay_e_n);
  upd_emi_left = Math.ceil((amt - amt_paid) / emi);
  printSolution(bn, brn, Math.min(amt, amt_paid), upd_emi_left);
};

const processBalance = (inputLine) => {
  const [, bn, brn, emi_no] = inputLine.split(' ');
  const [, , , p, n, r] = getLoansByBorrowerName(brn).split(' ');
  const paymByBorr = getpaymByBorrName(brn);
  const interest = (p * n * r) / 100;
  const amt = interest + parseInt(p);
  const tot_emi = n * 12;
  if (paymByBorr.length === 0) {
    // no payments
    beforePayment(tot_emi, emi_no, amt, bn, brn);
  } else {
    const [, , brn, lamt, pay_e_n] = paymByBorr[0].split(' ');
    const emi = Math.ceil(amt / tot_emi);
    if (pay_e_n <= emi_no) {
      // after payment
      afterSinglePayment(emi, pay_e_n, amt, lamt, emi_no, bn, brn);
    } else if (paymByBorr.length === 1) {
      // before payment
      beforePayment(tot_emi, emi_no, amt, bn, brn);
    } else {
      console.log('Multiple payments not supported');
    }
  }
};

const printSolution = (bn, brn, a, e) => {
  console.log(bn, ' ', brn, ' ', a, ' ', e);
};
