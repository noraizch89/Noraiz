-- CREATE DATABASE
CREATE DATABASE WalletAppDB;
GO

-- USE DATABASE
USE WalletAppDB;
GO

-- ======================
-- TABLE: Users
-- ======================
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    MobileNumber VARCHAR(20) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Status VARCHAR(20) NOT NULL DEFAULT 'Pending',  -- 'Pending', 'Approved'
    Balance FLOAT NOT NULL DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- ======================
-- TABLE: Transactions
-- ======================
CREATE TABLE Transactions (
    TransactionID INT IDENTITY(1,1) PRIMARY KEY,
    SenderID INT NOT NULL,
    ReceiverID INT NOT NULL,
    Amount FLOAT NOT NULL,
    Type VARCHAR(50) NOT NULL,  -- e.g., 'Transfer', 'Deposit'
    Timestamp DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (SenderID) REFERENCES Users(UserID),
    FOREIGN KEY (ReceiverID) REFERENCES Users(UserID)
);
GO

-- ======================
-- TABLE: Beneficiaries
-- ======================
CREATE TABLE Beneficiaries (
    BeneficiaryID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    BeneficiaryUserID INT NOT NULL,
    AddedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (BeneficiaryUserID) REFERENCES Users(UserID),
    CONSTRAINT UC_User_Beneficiary UNIQUE (UserID, BeneficiaryUserID)
);
GO

-- ======================
-- INDEXES (Optional but Recommended)
-- ======================
CREATE INDEX IX_Users_Mobile ON Users (MobileNumber);
CREATE INDEX IX_Transactions_Sender ON Transactions (SenderID);
CREATE INDEX IX_Transactions_Receiver ON Transactions (ReceiverID);
GO
