require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../models/Question');

const questions = [
  // Chapter 2: Inverse Trigonometric Functions (30 Qs)
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "A function is invertible if it is:", "options": ["Bijective", "Injective", "Surjective", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "Inverse function of f(x) is written as:", "options": ["f⁻¹(x)", "f(x)", "x", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "Number of inverse trigonometric functions are:", "options": ["6", "3", "4", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "sin⁻¹x domain is:", "options": ["[-1,1]", "(-∞,∞)", "[0,π]", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "Range of sin⁻¹x is:", "options": ["[-π/2, π/2]", "[0,π]", "(-∞,∞)", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "Domain of cos⁻¹x is:", "options": ["[-1,1]", "(-∞,∞)", "[0,π]", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "Range of cos⁻¹x is:", "options": ["[0,π]", "[-π/2,π/2]", "(-∞,∞)", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "Domain of tan⁻¹x is:", "options": ["(-∞,∞)", "[-1,1]", "[0,π]", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "Range of tan⁻¹x is:", "options": ["(-π/2, π/2)", "[0,π]", "[-1,1]", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "Domain of sec⁻¹x is:", "options": ["x≤-1 or x≥1", "[-1,1]", "(-∞,∞)", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "Principal value of sin⁻¹x lies between:", "options": ["-π/2 to π/2", "0 to π", "0 to 2π", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "Principal value of cos⁻¹x lies between:", "options": ["0 to π", "-π/2 to π/2", "0 to 2π", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "sin⁻¹(1/2) =", "options": ["π/6", "π/3", "π/4", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "sin⁻¹(-1/2) =", "options": ["-π/6", "π/6", "π/3", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "tan⁻¹(1) =", "options": ["π/4", "π/2", "π/6", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "tan⁻¹(-1) =", "options": ["-π/4", "π/4", "π/6", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "cos⁻¹(1/2) =", "options": ["π/3", "π/6", "π/4", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "cos⁻¹(-1/2) =", "options": ["2π/3", "π/3", "π/6", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "cosec⁻¹(√2) =", "options": ["π/4", "π/3", "π/6", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "sec⁻¹(2/√3) =", "options": ["π/6", "π/3", "π/4", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "cot⁻¹(√3) =", "options": ["π/6", "π/3", "π/4", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "cot⁻¹(-√3) =", "options": ["5π/6", "π/6", "π/3", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "Principal values are:", "options": ["Ranges", "Domains", "Functions", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "Range of cot⁻¹x is:", "options": ["(0,π)", "(-π/2,π/2)", "[-1,1]", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "Range of cosec⁻¹x excludes:", "options": ["0", "π", "π/2", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "Range of sec⁻¹x excludes:", "options": ["π/2", "π", "0", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "Inverse trig functions give:", "options": ["Angles", "Numbers", "Matrices", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "sin⁻¹x graph is:", "options": ["Increasing", "Decreasing", "Constant", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "cos⁻¹x graph is:", "options": ["Decreasing", "Increasing", "Constant", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Inverse Trigonometric Functions", "question": "tan⁻¹x graph is:", "options": ["Increasing", "Decreasing", "Constant", "None"], "correctIndex": 0 },

  // Chapter 3: Matrix Algebra (30 Qs)
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "A matrix is a:", "options": ["Rectangular array", "Number", "Function", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Order of matrix means:", "options": ["Rows × Columns", "Columns × Rows", "Only rows", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "A square matrix has:", "options": ["Equal rows and columns", "More rows", "More columns", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Row matrix has:", "options": ["One row", "One column", "Equal", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Column matrix has:", "options": ["One column", "One row", "Equal", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Zero matrix contains:", "options": ["All zeros", "All ones", "Mixed", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Identity matrix has:", "options": ["Diagonal ones", "All ones", "Zeros", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Diagonal matrix has:", "options": ["Non-zero diagonal", "All equal", "Random", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Scalar matrix is:", "options": ["Diagonal equal elements", "All zero", "Random", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Equal matrices have:", "options": ["Same order & elements", "Only same order", "Only elements", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Matrix addition requires:", "options": ["Same order", "Different", "Square", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "A+B = B+A is:", "options": ["Commutative", "Associative", "Distributive", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "(A+B)+C = A+(B+C) is:", "options": ["Associative", "Commutative", "None", "Random"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Matrix subtraction means:", "options": ["A-B", "A+B", "AB", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Scalar multiplication means:", "options": ["Multiply each element", "Add", "Subtract", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Matrix multiplication defined when:", "options": ["Columns of A = rows of B", "Same order", "Square", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Matrix multiplication is:", "options": ["Not commutative", "Commutative", "Always equal", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "AB ≠ BA means:", "options": ["Non-commutative", "Commutative", "Equal", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Transpose of matrix A is:", "options": ["Aᵀ", "A⁻¹", "A²", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Transpose means:", "options": ["Rows become columns", "Add", "Multiply", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "(Aᵀ)ᵀ =", "options": ["A", "0", "I", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "(A+B)ᵀ =", "options": ["Aᵀ+Bᵀ", "AB", "BA", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "(AB)ᵀ =", "options": ["BᵀAᵀ", "AᵀBᵀ", "AB", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Symmetric matrix satisfies:", "options": ["Aᵀ = A", "Aᵀ = -A", "A=0", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Skew-symmetric matrix satisfies:", "options": ["Aᵀ = -A", "Aᵀ = A", "A=I", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Diagonal elements of skew-symmetric are:", "options": ["0", "1", "Random", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Identity matrix denoted by:", "options": ["I", "A", "B", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Zero matrix denoted by:", "options": ["O", "I", "A", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "A+A =", "options": ["2A", "A²", "0", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Matrices", "question": "Matrix algebra deals with:", "options": ["Matrices", "Numbers", "Vectors", "None"], "correctIndex": 0 },

  // Chapter 4: Determinants (30 Qs)
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Determinant is defined only for:", "options": ["Square matrix", "Any matrix", "Row matrix", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "|A| denotes:", "options": ["Determinant", "Matrix", "Inverse", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Determinant of 1×1 matrix is:", "options": ["Element itself", "0", "1", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Determinant of identity matrix is:", "options": ["1", "0", "n", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "If two rows are equal, determinant is:", "options": ["0", "1", "∞", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Interchanging two rows changes determinant by:", "options": ["Sign", "Value", "No change", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "If one row is zero, determinant is:", "options": ["0", "1", "∞", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Multiplying a row by k multiplies determinant by:", "options": ["k", "k²", "1", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "|kA| =", "options": ["kⁿ|A|", "k|A|", "|A|", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Determinant of triangular matrix is:", "options": ["Product of diagonal", "Sum", "0", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Minor of element aij is:", "options": ["Sub-determinant", "Matrix", "Value", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Cofactor is:", "options": ["(-1)^(i+j) Mij", "Mij", "Aij", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Cofactor matrix contains:", "options": ["All cofactors", "Elements", "Minors", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Adjoint of A is:", "options": ["Transpose of cofactor matrix", "Inverse", "Matrix", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Adj(A)ᵀ equals:", "options": ["Cofactor matrix", "A", "I", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Inverse of matrix exists if:", "options": ["|A| ≠ 0", "|A| = 0", "A=0", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Inverse formula is:", "options": ["A⁻¹ = adj(A)/|A|", "A/|A|", "|A|A", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "If |A| = 0, matrix is:", "options": ["Singular", "Non-singular", "Identity", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "If |A| ≠ 0, matrix is:", "options": ["Non-singular", "Singular", "Zero", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "A adj(A) =", "options": ["|A|I", "A", "0", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Determinant used to find:", "options": ["Area", "Volume", "Length", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Collinear points determinant is:", "options": ["0", "1", "∞", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "System of equations solved using:", "options": ["Cramer's rule", "Matrix only", "Graph", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Cramer's rule requires:", "options": ["|A| ≠ 0", "|A| = 0", "None", "Random"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Unique solution exists if:", "options": ["|A| ≠ 0", "|A| = 0", "Infinite", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "No solution occurs if:", "options": ["Inconsistent system", "Consistent", "Unique", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Infinite solutions if:", "options": ["Dependent equations", "Independent", "Unique", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Determinant of 2×2 matrix is:", "options": ["ad-bc", "ab-cd", "a+b", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Determinant value is:", "options": ["Scalar", "Matrix", "Vector", "None"], "correctIndex": 0 },
  { "board": "Kerala State", "class": "+2", "medium": "English", "subject": "Mathematics", "chapter": "Determinants", "question": "Determinants help in:", "options": ["Solving equations", "Drawing", "Coloring", "None"], "correctIndex": 0 }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Remove old versions of these chapters
    await Question.deleteMany({
      subject: "Mathematics",
      class: "+2",
      chapter: { $in: ["Inverse Trigonometric Functions", "Matrices", "Determinants", "Inverse Circular Functions", "Matrix Algebra"] }
    });

    const result = await Question.insertMany(questions.map(q => ({ ...q, level: 1 })));
    console.log(`🚀 Final Seeding Success: Added ${result.length} questions for Chapters 2, 3, and 4! peace.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
