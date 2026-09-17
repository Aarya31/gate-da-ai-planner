package com.gateda.planner.config;

import com.gateda.planner.entity.Subject;
import com.gateda.planner.entity.Subtopic;
import com.gateda.planner.entity.Topic;
import com.gateda.planner.repository.SubjectRepository;
import com.gateda.planner.repository.SubtopicRepository;
import com.gateda.planner.repository.TopicRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

@Component
public class SyllabusDataSeeder implements CommandLineRunner {

    private final SubjectRepository subjectRepository;
    private final TopicRepository topicRepository;
    private final SubtopicRepository subtopicRepository;

    public SyllabusDataSeeder(SubjectRepository subjectRepository, TopicRepository topicRepository, SubtopicRepository subtopicRepository) {
        this.subjectRepository = subjectRepository;
        this.topicRepository = topicRepository;
        this.subtopicRepository = subtopicRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (subjectRepository.count() > 0) {
            return; // Already initialized
        }

        // 1. Probability & Statistics
        Subject prob = createSubject("Probability & Statistics", 1, "CORE_DA");
        createTopic(prob, "Permutations & Combinations", 4, 1, "Basic Counting", "P&C Formulas", "Pigeonhole Principle");
        createTopic(prob, "Probability Axioms & Events", 4, 2, "Sample Space", "Independent Events", "Mutual Exclusivity");
        createTopic(prob, "Conditional Probability & Bayes Theorem", 5, 3, "Conditional Probability", "Bayes Rule", "Prior and Posterior");
        createTopic(prob, "Random Variables", 5, 4, "Discrete RV", "Continuous RV", "PMF & PDF", "CDF");
        createTopic(prob, "Expectation & Moments", 4, 5, "Mean & Expected Value", "Variance & Std Dev", "Covariance", "Correlation Coefficient");
        createTopic(prob, "Probability Distributions", 5, 6, "Bernoulli & Binomial", "Poisson Distribution", "Uniform & Exponential", "Normal Distribution");
        createTopic(prob, "Limit Theorems & Hypothesis Testing", 4, 7, "Central Limit Theorem", "Law of Large Numbers", "t-Test & z-Test", "Confidence Intervals");

        // 2. Linear Algebra
        Subject la = createSubject("Linear Algebra", 2, "CORE_DA");
        createTopic(la, "Vector Spaces & Subspaces", 4, 1, "Vector Spaces", "Subspaces", "Linear Independence", "Basis & Dimension");
        createTopic(la, "Matrices & Linear Systems", 5, 2, "Matrix Multiplication", "Determinants & Trace", "System of Linear Equations", "Gaussian Elimination");
        createTopic(la, "Eigenvalues & Eigenvectors", 5, 3, "Characteristic Equation", "Eigenvalue Properties", "Spectral Theorem", "Diagonalization");
        createTopic(la, "Matrix Decompositions", 5, 4, "LU Decomposition", "QR Factorization", "Singular Value Decomposition (SVD)");

        // 3. Calculus & Optimization
        Subject calc = createSubject("Calculus & Optimization", 3, "CORE_DA");
        createTopic(calc, "Single Variable Calculus", 4, 1, "Limits & Continuity", "Differentiability", "Taylor Series", "Maxima & Minima");
        createTopic(calc, "Multivariable Calculus", 4, 2, "Partial Derivatives", "Gradient & Directional Derivatives", "Hessian Matrix");
        createTopic(calc, "Optimization & Convexity", 5, 3, "Convex Sets & Functions", "Local vs Global Minima", "Lagrange Multipliers", "Gradient Descent");

        // 4. Programming
        Subject prog = createSubject("Programming", 4, "CORE_DA");
        createTopic(prog, "Basic Programming Constructs", 4, 1, "Data Types & Operators", "Control Flow", "Functions & Scope", "Recursion");
        createTopic(prog, "Pointers & Memory Management", 4, 2, "Pointers & References", "Arrays & Strings", "Dynamic Memory Allocation");
        createTopic(prog, "OOP Concepts", 3, 3, "Classes & Objects", "Inheritance", "Polymorphism & Abstraction");

        // 5. Data Structures & Algorithms
        Subject dsa = createSubject("Data Structures & Algorithms", 5, "CORE_DA");
        createTopic(dsa, "Linear Data Structures", 4, 1, "Arrays & Linked Lists", "Stacks & Queues");
        createTopic(dsa, "Trees & Graphs", 5, 2, "Binary Trees & BST", "Heaps & Priority Queues", "Graph Representation");
        createTopic(dsa, "Asymptotic Analysis & Sorting", 4, 3, "Big-O Notation", "QuickSort & MergeSort", "HeapSort & Hashing");
        createTopic(dsa, "Algorithm Design Techniques", 5, 4, "BFS & DFS", "Dijkstra's Algorithm", "Dynamic Programming", "Greedy Approach");

        // 6. Database Management Systems
        Subject dbms = createSubject("Database Management Systems", 6, "CORE_DA");
        createTopic(dbms, "ER & Relational Model", 4, 1, "ER Diagrams", "Relational Algebra", "Keys & Constraints");
        createTopic(dbms, "SQL Queries", 5, 2, "DDL/DML Commands", "Joins & Subqueries", "Aggregations & Grouping", "Window Functions");
        createTopic(dbms, "Normalization", 5, 3, "Functional Dependencies", "1NF, 2NF, 3NF", "BCNF");
        createTopic(dbms, "Transactions & Indexing", 4, 4, "ACID Properties", "Concurrency Control", "B-Trees & B+ Trees");

        // 7. Data Warehousing
        Subject dwh = createSubject("Data Warehousing", 7, "CORE_DA");
        createTopic(dwh, "Data Warehouse Architecture", 3, 1, "OLTP vs OLAP", "Warehouse Architecture", "ETL Pipelines");
        createTopic(dwh, "Dimensional Modeling & OLAP", 4, 2, "Star Schema", "Snowflake Schema", "Fact & Dimension Tables", "Roll-up & Drill-down");

        // 8. Machine Learning
        Subject ml = createSubject("Machine Learning", 8, "CORE_DA");
        createTopic(ml, "Supervised Learning - Regression", 5, 1, "Linear Regression", "Ridge & Lasso Regularization", "Polynomial Regression");
        createTopic(ml, "Supervised Learning - Classification", 5, 2, "Logistic Regression", "Decision Trees & Random Forests", "SVM", "KNN & Naive Bayes");
        createTopic(ml, "Unsupervised Learning", 4, 3, "K-Means Clustering", "Hierarchical Clustering", "DBSCAN", "PCA");
        createTopic(ml, "ML Evaluation & Tuning", 5, 4, "Accuracy, Precision, Recall, F1", "ROC-AUC Curve", "Bias-Variance Tradeoff", "Cross Validation");

        // 9. Artificial Intelligence
        Subject ai = createSubject("Artificial Intelligence", 9, "CORE_DA");
        createTopic(ai, "Search Algorithms", 4, 1, "BFS, DFS & Uniform Cost", "A* Search & Heuristics", "Minimax & Alpha-Beta Pruning");
        createTopic(ai, "Logic & Knowledge Representation", 3, 2, "Propositional Logic", "First-Order Logic", "Constraint Satisfaction Problems");
        createTopic(ai, "Neural Networks & Deep Learning", 5, 3, "Perceptron & MLP", "Backpropagation", "Activation Functions", "CNNs & Transformers");

        // 10. General Aptitude
        Subject apt = createSubject("General Aptitude", 10, "APTITUDE");
        createTopic(apt, "Verbal Aptitude", 3, 1, "Vocabulary & Grammar", "Reading Comprehension", "Sentence Completion");
        createTopic(apt, "Quantitative Aptitude", 4, 2, "Ratios & Percentages", "Time, Work & Distance", "Geometry & Mensuration");
        createTopic(apt, "Analytical & Spatial Aptitude", 4, 3, "Deductive Reasoning", "Syllogisms", "Data Interpretation");
    }

    private Subject createSubject(String name, int order, String category) {
        Subject subject = new Subject(name, order, category);
        return subjectRepository.save(subject);
    }

    private void createTopic(Subject subject, String topicName, int weightage, int order, String... subtopics) {
        Topic topic = new Topic(subject, topicName, weightage, order);
        topic = topicRepository.save(topic);

        for (String sub : subtopics) {
            Subtopic subtopic = new Subtopic(topic, sub);
            subtopicRepository.save(subtopic);
        }
    }
}
