

import { AllCampusData, User, UserRole, CampusId, Theme } from './types';

export const USERS: User[] = [
  { id: 1, username: 'main', password: 'password', name: 'Shuja Anwar Ahmed Hashmi', role: UserRole.Admin, campusId: CampusId.Main },
  { id: 2, username: 'johar', password: 'password', name: 'Johar Campus User', role: UserRole.CampusUser, campusId: CampusId.Johar },
  { id: 3, username: 'masjid', password: 'password', name: 'Masjid Campus User', role: UserRole.CampusUser, campusId: CampusId.Masjid },
  { id: 4, username: 'maktab', password: 'password', name: 'Maktab Campus User', role: UserRole.CampusUser, campusId: CampusId.Maktab },
];

export const INITIAL_DATA: AllCampusData = {
  main: {
    tasks: {
      today: [],
      daily: [
        { id: "D-01", description: "Donation & Receipt Management", isFixed: true, completed: false },
        { id: "D-02", description: "Coin Box Management", isFixed: true, completed: false },
        { id: "D-03", description: "Expense Recording", isFixed: true, completed: false },
        { id: "D-04", description: "Daily Cash Reconciliation", isFixed: true, completed: false },
        { id: "D-05", description: "Security Guard Payment Processing", isFixed: true, completed: false }
      ],
      weekly: [
        { id: "W-01", description: "Bank Reconciliation - All Campuses", isFixed: true, completed: false },
        { id: "W-02", description: "All-Campus Shortfall Report", isFixed: true, completed: false },
        { id: "W-03", description: "Expense Verification", isFixed: true, completed: false },
        { id: "W-04", description: "Petty Cash Checking & Reimbursement", isFixed: true, completed: false },
        { id: "W-05", description: "Bank Reconciliation - Main Campus", isFixed: true, completed: false }
      ],
      monthly: [
        { id: "M-01", description: "Utility Bill Payments", isFixed: true, completed: false },
        { id: "M-02", description: "Financial Reporting", isFixed: true, completed: false },
        { id: "M-03", description: "Tax Payments", isFixed: true, completed: false },
        { id: "M-04", description: "Zakat Fund Adjustment", isFixed: true, completed: false },
        { id: "M-05", description: "Construction Payments", isFixed: true, completed: false },
        { id: "M-06", description: "Bank Reconciliation - Main Campus", isFixed: true, completed: false },
        { id: "M-07", description: "Security Guard Salary Processing", isFixed: true, completed: false }
      ],
    },
    bills: [
      { type: "Storm Fiber", location: "Main Campus", account: "0333-3265994", paid: false },
      { type: "Storm Fiber", location: "Main Campus", account: "0300-2225354", paid: false },
      { type: "PTCL", location: "Main Campus", account: "021-34613474", paid: false },
      { type: "K-Electric", location: "Main Campus", account: "0400030577440", paid: false },
      { type: "K-Electric", location: "Main Campus", account: "0400030577416", paid: false },
      { type: "K-Electric", location: "Main Campus", account: "0400030577432", paid: false },
      { type: "SSGC (Gas)", location: "Main Campus", account: "2490615583", paid: false },
      { type: "SSGC (Gas)", location: "Main Campus", account: "1477885228", paid: false }
    ]
  },
  johar: {
    tasks: {
      today: [],
      daily: [
        { id: "JD-01", description: "Petty Cash Management", isFixed: true, completed: false },
        { id: "JD-02", description: "Campus Maintenance", isFixed: true, completed: false },
        { id: "JD-03", description: "Petty Cash Checking & Reimbursement", isFixed: true, completed: false },
        { id: "JD-04", description: "Security Guard Payment Processing", isFixed: true, completed: false },
        { id: "JCL-D-01", description: "Dusting Every Office On Daily Base.", isFixed: true, completed: false },
        { id: "JCL-D-02", description: "Puncha On Ground Floor Daily.", isFixed: true, completed: false },
        { id: "JCL-D-03", description: "Stairs Cleaning Daily.", isFixed: true, completed: false },
        { id: "JCL-D-04", description: "Top Floor Washroom Cleaning Daily.", isFixed: true, completed: false },
        { id: "JCL-D-05", description: "Roof Cleaning Daily.", isFixed: true, completed: false }
      ],
      weekly: [
        { id: "JW-01", description: "Johar Campus Reporting", isFixed: true, completed: false },
        { id: "JW-02", description: "Bank Reconciliation - Johar Campus", isFixed: true, completed: false },
        { id: "JCL-W-01", description: "Dewan E Aaam Cleaning With Machine (Thursday for Islahi Majlees).", isFixed: true, completed: false },
        { id: "JCL-W-02", description: "Mudeer Office Cleaning With Machine.", isFixed: true, completed: false },
        { id: "JCL-W-03", description: "Book Shop Cleaning With Machine.", isFixed: true, completed: false },
        { id: "JCL-W-04", description: "Account Office Cleaning With Machine.", isFixed: true, completed: false },
        { id: "JCL-W-05", description: "Office Of Ladies Cleaning With Machine.", isFixed: true, completed: false },
        { id: "JCL-W-06", description: "Basement Cleaning With Machine.", isFixed: true, completed: false },
        { id: "JCL-W-07", description: "Ladies Street and Door Cleaning With Jaro.", isFixed: true, completed: false },
        { id: "JCL-W-08", description: "Office Of Teachers Cleaning With Machine.", isFixed: true, completed: false },
        { id: "JCL-W-09", description: "Nazra Class also Cleaning With Machine.", isFixed: true, completed: false },
        { id: "JCL-W-10", description: "Hifz Class Cleaning With Machine.", isFixed: true, completed: false },
        { id: "JCL-W-11", description: "Cleaning Every Room Washroom Weekly.", isFixed: true, completed: false },
        { id: "JKT-W-01", description: "Cleaning Kitchen after three days (twice a week).", isFixed: true, completed: false },
        { id: "JKT-W-02", description: "Weekly Vegetable procurement.", isFixed: true, completed: false },
        { id: "JKT-W-03", description: "On every Tuesday and Saturday (2KG) Yogurt for Breakfast.", isFixed: true, completed: false },
        { id: "JKT-W-04", description: "On every Thursday (2KG) Yogurt + Raita ingredients for Dinner.", isFixed: true, completed: false },
        { id: "JKT-W-05", description: "On every Saturday (2KG) Yogurt + Raita ingredients for Lunch.", isFixed: true, completed: false },
        { id: "JKT-W-06", description: "On every Friday Some Vegetable Masala.", isFixed: true, completed: false },
        { id: "JKT-W-07", description: "On every Friday and Sunday Eggs for Break Fast.", isFixed: true, completed: false },
      ],
      monthly: [
        { id: "JM-01", description: "Staff Salary Processing", isFixed: true, completed: false },
        // FIX: Corrected a typo in the object key from `id::` to `id:`.
        { id: "JM-02", description: "Inventory Management", isFixed: true, completed: false },
        { id: "JM-03", description: "Bank Reconciliation - Johar Campus", isFixed: true, completed: false },
        { id: "JM-04", description: "Security Guard Salary Processing", isFixed: true, completed: false },
        { id: "JCL-M-01", description: "Cleaning Glasses in Ground Floor.", isFixed: true, completed: false },
        { id: "JCL-M-02", description: "Cleaning Every Closet in all building.", isFixed: true, completed: false },
        { id: "JCL-M-03", description: "Cleaning Every AC Filter in a Month.", isFixed: true, completed: false },
        { id: "JCL-M-04", description: "Cleaning Every Mat in washrooms monthly.", isFixed: true, completed: false },
        { id: "JCL-M-05", description: "Cleaning all the doors in Building.", isFixed: true, completed: false },
        { id: "JKT-M-01", description: "Ordering Ration Monthly.", isFixed: true, completed: false },
        { id: "JTR-M-01", description: "Karwan Car: Change Oil, Oil Filter, Air Filter After 3000KM.", isFixed: true, completed: false }
      ]
    },
    bills: [
      { type: "PTCL", location: "Johar Campus", account: "021-34623474", paid: false },
      { type: "PTCL", location: "Johar Campus", account: "021-34633474", paid: false },
      { type: "K-Electric", location: "Johar Campus", account: "0400030577440", paid: false },
      { type: "Jazz Sims", location: "Johar Campus", account: "Prepaid Sims", paid: false }
    ]
  },
  masjid: {
    tasks: {
      today: [],
      daily: [],
      weekly: [
        { id: "MSJ-W01", description: "Bank Reconciliation - Masjid Campus", isFixed: true, completed: false }
      ],
      monthly: [
        { id: "MSJ-01", description: "Masjid Maintenance Funds", isFixed: true, completed: false },
        { id: "MSJ-02", description: "Monthly Report for Namazi Hazrat", isFixed: true, completed: false },
        { id: "MSJ-03", description: "Monthly Tauqeel Process - Masjid Campus", isFixed: true, completed: false }
      ]
    },
    bills: [
      { type: "PTCL", location: "Masjid Shafeeq ur Rahman", account: "021-34152794", paid: false },
      { type: "K-Electric", location: "Masjid Shafeeq ur Rahman", account: "0400041707966", paid: false }
    ]
  },
  maktab: {
    tasks: {
      today: [],
      daily: [],
      weekly: [
        { id: "MKT-W01", description: "Bank Reconciliation - Maktab Campus", isFixed: true, completed: false }
      ],
      monthly: [
        { id: "MKT-01", description: "Maktab Operations Funding", isFixed: true, completed: false },
        { id: "MKT-02", description: "Educational Materials", isFixed: true, completed: false }
      ]
    },
    bills: [
        { type: "SSGC (Gas)", location: "Hostel", account: "8354450000", paid: false },
        { type: "K-Electric", location: "Maktab Campus", account: "0400044902344 - C.No # LB516523", paid: false },
        { type: "K-Electric", location: "Maktab Campus", account: "0400044902409 - C.No # LB516528", paid: false },
        { type: "K-Electric", location: "Maktab Campus", account: "0400044902387 - C.No # LB516527", paid: false },
        { type: "K-Electric", location: "Maktab Campus", account: "0400044902360 - C.No # LB516525", paid: false },
        { type: "K-Electric", location: "Maktab Campus", account: "0400044902352 - C.No # LB516524", paid: false },
        { type: "K-Electric", location: "Maktab Campus", account: "0400044902379 - C.No # LB516526", paid: false }
    ]
  }
};

export const THEMES: Theme[] = [
    { name: 'cream', colors: { '--bg-gradient-start': '#f5f1e6', '--bg-gradient-end': '#e8e2d1', '--primary': '#2c3e50', '--header-bg-start': '#2c3e50', '--header-bg-end': '#34495e', '--card-bg': '#ffffff', '--text-color': '#333333', '--text-color-inverted': '#ffffff', '--cream-light': '#f9f7f2', '--cream-dark': '#e8e2d1' }},
    { name: 'blue', colors: { '--bg-gradient-start': '#3498db', '--bg-gradient-end': '#2c3e50', '--primary': '#2980b9', '--header-bg-start': '#2c3e50', '--header-bg-end': '#34495e', '--card-bg': '#ffffff', '--text-color': '#333333', '--text-color-inverted': '#ffffff', '--cream-light': '#f8f9fa', '--cream-dark': '#e9ecef' }},
    { name: 'green', colors: { '--bg-gradient-start': '#27ae60', '--bg-gradient-end': '#16a085', '--primary': '#27ae60', '--header-bg-start': '#27ae60', '--header-bg-end': '#2ecc71', '--card-bg': '#ffffff', '--text-color': '#333333', '--text-color-inverted': '#ffffff', '--cream-light': '#f8f9fa', '--cream-dark': '#e9ecef' }},
    { name: 'purple', colors: { '--bg-gradient-start': '#8e44ad', '--bg-gradient-end': '#9b59b6', '--primary': '#8e44ad', '--header-bg-start': '#8e44ad', '--header-bg-end': '#9b59b6', '--card-bg': '#ffffff', '--text-color': '#333333', '--text-color-inverted': '#ffffff', '--cream-light': '#f8f9fa', '--cream-dark': '#e9ecef' }},
    { name: 'orange', colors: { '--bg-gradient-start': '#e67e22', '--bg-gradient-end': '#d35400', '--primary': '#e67e22', '--header-bg-start': '#e67e22', '--header-bg-end': '#f39c12', '--card-bg': '#ffffff', '--text-color': '#333333', '--text-color-inverted': '#ffffff', '--cream-light': '#f8f9fa', '--cream-dark': '#e9ecef' }},
    { name: 'dark', colors: { '--bg-gradient-start': '#232526', '--bg-gradient-end': '#414345', '--primary': '#3498db', '--header-bg-start': '#2c3e50', '--header-bg-end': '#34495e', '--card-bg': '#3b3e42', '--text-color': '#ecf0f1', '--text-color-inverted': '#ecf0f1', '--cream-light': '#4a4d52', '--cream-dark': '#2c3e50' }},
    { name: 'nature', colors: { '--bg-gradient-start': '#1abc9c', '--bg-gradient-end': '#16a085', '--primary': '#16a085', '--header-bg-start': '#16a085', '--header-bg-end': '#1abc9c', '--card-bg': '#ffffff', '--text-color': '#333333', '--text-color-inverted': '#ffffff', '--cream-light': '#f8f9fa', '--cream-dark': '#e9ecef' }},
];