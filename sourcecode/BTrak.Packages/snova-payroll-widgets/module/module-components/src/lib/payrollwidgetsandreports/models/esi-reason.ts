export const ReasonData = [
    {
        reason: "Without Reason",
        code:0,
        note:"Leave last working day as blank"
    },
    {
        reason: "On Leave",
        code:1,
        note:"Leave last working day as blank"
    },
    {
        reason: "Left Service",
        code:2,
        note:"Please provide last working day(dd/mm/yyyy). IP will not appear from next wage period"
    },
    {
        reason: "Retired",
        code:3,
        note:"Please provide last working day(dd/mm/yyyy). IP will not appear from next wage period"
    },
    {
        reason: "Out of Coverage",
        code:4,
        note:"Please provide last working day(dd/mm/yyyy). IP will not appear from next wage period.This option is valid only if Wage period is April/October. In case any other month then IP will continue to appear in the list."
    },
    {
        reason: "Expired",
        code:5,
        note:"Please provide last working day(dd/mm/yyyy). IP will not appear from next wage period"
    },
    {
        reason: "Not Implemented area",
        code:6,
        note:"Please provide last working day(dd/mm/yyyy)."
    },
    {
        reason: "Compliance by Immediate Employer",
        code:7,
        note:"Leave last working day as blank"
    },
    {
        reason: "Suspension of work",
        code:8,
        note:"Leave last working day as blank"
    },
    {
        reason: "Strike/Lockout",
        code:9,
        note:"Leave last working day as blank"
    },
    {
        reason: "Retrenchment",
        code:10,
        note:"Please provide last working day(dd/mm/yyyy). IP will not appear from next wage period"
    },
    {
        reason: "No Work",
        code:11,
        note:"Leave last working day as blank"
    },
    {
        reason: "Doesn't Belong To This Employer",
        code:12,
        note:"Leave last working day as blank"
    },
    {
        reason: "Duplicate IP",
        code:13,
        note:"Leave last working day as blank"
    }
]
export const InstructionData=[
    {
        instruction:"1. Enter the IP number,  IP name, No. of Days, Total Monthly Wages, Reason for 0 wages(If Wages ‘0’) & Last Working Day( only if employee left service, Retired, Out of coverage, Expired, Non-Implemented area or Retrenchment. For other reasons,  last working day  must be left  BLANK).  "
    },
    {
        instruction:"2. Number of days must me a whole number.  Fractions should be rounded up to next higher whole number/integer"
    },
    {
        instruction:"3. Excel sheet upload will lead to successful transaction only when all the Employees’ (who are currently mapped in the system) details are entered perfectly in the excel sheet"
    },
    {
        instruction:"4. Reasons are to be assigned numeric code  and date has to be provided as mentioned in the table above"
    },
    {
        instruction:"5. Once  0 wages given and last working day is mentioned as in reason codes (2,3,4,5,10)  IP will be removed from the employer’s record. Subsequent months will not have this IP listed under the employer. Last working day should be mentioned only if 'Number of days wages paid/payable' is '0'."
    },
    {
        instruction:"6. In case IP has worked for part of the month(i.e. atleast 1 day wage is paid/payable) and left in between of the month, then last working day shouldn’t be mentioned."
    },
    {
        instruction:"7. Calculations – IP Contribution and Employer contribution calculation will be automatically done by the system"
    },
    {
        instruction:"8. Date  column format is  dd/mm/yyyy or dd-mm-yyyy.  Pad single digit dates with 0.  Eg:- 2/5/2010  or  2-May-2010 is NOT acceptable.  Correct format  is 02/05/2010 or 02-05-2010"
    },
    {
        instruction:"9. Excel file should be saved in .xls format (Excel 97-2003)"
    },
    {
        instruction:"10. Note that all the column including date column should be in ‘Text’ format"
    },
    {
        instruction:"10a. To convert  all columns to text,"
    },
    {
        instruction:"      a.  Select column A; Click Data in Menu Bar on top;  Select Text to Columns ; Click Next (keep default selection of Delimited);  Click Next (keep default selection of Tab); Select  TEXT;  Click FINISH.  Excel 97 – 2003 as well have TEXT to COLUMN  conversion facility"
    },
    {
        instruction:"      b.  Repeat the above step for each of the 6 columns. (Columns A – F )"
    },
    {
        instruction:"10b.   Another method that can be used to text conversion is – copy the column with data and paste it in NOTEPAD.  Select the column (in excel) and convert to text. Copy the data back from notepad to excel"
    },
    {
        instruction:"11.   If problem continues while upload,  download a fresh template by clicking 'Sample MC Excel Template'. Then copy the data area from Step 8a.a – eg:  copy Cell A2 to F8 (if there is data in 8 rows); Paste it in cell A2 in the fresh template. Upload it "
    },
    {
        instruction:"Note :   Kindly turn  OFF   ‘POP UP BLOCKER’  if it is ON in your  browser.  Follow the steps given to turn off  pop up blocker . This  is required to  upload Monthly contribution,  view or print  Challan /  TIC after uploading the excel   "
    },
    {
        instruction:"              1.Mozilla Firefox  3.5.11 :  From Menu Bar, select   Tools -> Options -> Content -> Uncheck (remove tick mark)‘Block Popup Windows’.   Click OK"
    },
    {
        instruction:"              2.  IE 7.0  :     From Menu Bar, select  Tools à Pop up Blocker à Turn Off Pop up Blocker "
    }
]