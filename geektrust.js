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
  // const [payment, bank_name, borrower_name, lump_sum_amount, emi_no] = inputLine.split(" ")
  payments.push(inputLine);
};

const processBalance = (inputLine) => {
  const [, bank_name, borrower_name, emi_no] = inputLine.split(' ');
  const [, , , principal, no_of_years, rate_of_interest] =
    getLoansByBorrowerName(borrower_name).split(' ');

  let paymentsByBorrower = [];
  paymentsByBorrower = getPaymentsByBorrowerName(borrower_name);
  const interest = (principal * no_of_years * rate_of_interest) / 100;
  const amount = parseInt(interest) + parseInt(principal);
  const total_emi = no_of_years * 12;

  if (paymentsByBorrower.length == 0) {
    const no_of_emis_left = total_emi - emi_no;
    const emi = Math.ceil(amount / total_emi);
    const amount_paid = Math.min(amount, emi * emi_no);
    console.log(
      bank_name,
      ' ',
      borrower_name,
      ' ',
      amount_paid,
      ' ',
      no_of_emis_left
    );
  } else {
    const [, , borrower_name, lump_sum_amount, payment_emi_no] =
      paymentsByBorrower[0].split(' ');
    const emi = Math.ceil(amount / total_emi);
    let amount_paid = '';
    if (payment_emi_no <= emi_no) {
      const amount_paid_before_payment = emi * payment_emi_no;
      const reduced_amount_to_be_paid =
        amount - (amount_paid_before_payment + parseInt(lump_sum_amount));
      let updated_no_of_emis_left = Math.ceil(reduced_amount_to_be_paid / emi);
      amount_paid =
        amount_paid_before_payment +
        parseInt(lump_sum_amount) +
        emi * (emi_no - payment_emi_no);
      updated_no_of_emis_left = Math.ceil((amount - amount_paid) / emi);

      // const amount_paid_after_payment =
      //   console.log(amount - reduced_amount_to_be_paid);
      console.log(
        bank_name,
        ' ',
        borrower_name,
        ' ',
        Math.min(amount, amount_paid),
        ' ',
        updated_no_of_emis_left
      );
    } else {
      const no_of_emis_left = total_emi - emi_no;
      const emi = Math.ceil(amount / total_emi);
      amount_paid = Math.min(amount, emi * emi_no);
      console.log(
        bank_name,
        ' ',
        borrower_name,
        ' ',
        amount_paid,
        ' ',
        no_of_emis_left
      );
    }
  }
};

const getLoansByBorrowerName = (borrower_name) => {
  let identifiedLoan = '';
  loans.some((v) => {
    v.includes(borrower_name) && (identifiedLoan = v);
  });
  return identifiedLoan;
};

const getPaymentsByBorrowerName = (borrower_name) => {
  let identifiedPayments = [];
  payments.some((v) => {
    v.includes(borrower_name) && identifiedPayments.push(v);
  });
  return identifiedPayments;
};
