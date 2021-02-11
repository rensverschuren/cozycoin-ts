import React, { useCallback, useEffect, useState } from 'react';
import sha256 from 'crypto-js/sha256';
import crypto from 'crypto';
import './App.css';

interface BlockInterface {
    nonce: string;
    prevHash?: string;
    hash?: string;
    transactions?: Transaction[];
}

enum TransactionType {
    Transfer,
    CreateWallet,
}

interface TransferTransactionData {
    from: string;
    to: string;
    amount: number;
}

interface CreateWalletTransactionData {
    name: string;
}

type TransactionData = TransferTransactionData | CreateWalletTransactionData;

interface TransactionInterface {
    data: TransactionData;
    type: TransactionType;
}

interface BlockchainInterface {
    blocks: Block[];
    pendingTransactions: Transaction[];
    getDifficulty: () => number;
}

const createNonce = () => crypto.randomBytes(20).toString('hex');

class Transaction implements TransactionInterface {
    public data;
    public type;

    constructor(data: TransactionData, type: TransactionType) {
        this.data = data;
        this.type = type;
    }
}

class Block implements BlockInterface {
    public transactions;
    public hash;
    public nonce = '';
    public prevHash = '';

    constructor(transactions: Transaction[]) {
        this.transactions = transactions;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return sha256(
            JSON.stringify(this.transactions) + this.nonce + this.prevHash,
        ).toString();
    }

    mineBlock(difficulty: number, callback: (value: unknown) => void) {
        console.log('Mining block...', this.hash);

        while (
            this.hash?.substring(0, difficulty) !==
            Array(difficulty + 1).join('0')
        ) {
            this.nonce = createNonce();
            this.hash = this.calculateHash();
        }

        callback(this);

        console.log('Block mined!');
    }
}

class Blockchain implements BlockchainInterface {
    public blocks: Block[] = [];
    public pendingTransactions: Transaction[] = [];

    constructor() {
        this.blocks.push(this.createGenisisBlock());
    }

    createGenisisBlock() {
        return new Block([]);
    }

    addTransaction(transaction: Transaction) {
        this.pendingTransactions.push(transaction);
    }

    getLastBlock() {
        return this.blocks[this.blocks.length - 1];
    }

    getDifficulty() {
        return 4;
    }

    minePendingTransactions() {
        return new Promise((resolve) => {
            const block = new Block(this.pendingTransactions);
            block.mineBlock(4, () => {
                this.blocks.push(block);
    
                this.pendingTransactions = [];

                resolve(block);
            });

        })
    }

    isValid() {
        return this.blocks.every((block, index) => {
            const prevBlock = this.blocks[index - 1];

            if (block.hash !== block.calculateHash()) {
                return false;
            }

            if (!prevBlock) {
                return true;
            }

            if (prevBlock?.hash !== block.prevHash) {
                return false;
            }

            return true;
        });
    }
}

const blockchain = new Blockchain();

function App() {
    const [blocks, setBlocks] = useState<Block[]>([]);

    const mine = async () => {
        await blockchain.minePendingTransactions();
        console.log(blockchain.blocks)
        setBlocks(blockchain.blocks);
    }

    // useEffect(() => {
    //     const interval = setInterval(mine);

    //     return () => clearInterval(interval);
    // }, [])

    useEffect(() => {
        console.log('Is chain valid?', blockchain.isValid());
    }, [blockchain]);

    const addTransaction = useCallback(
        (transaction: Transaction) => {
            blockchain.addTransaction(
                new Transaction(transaction.data, transaction.type),
            );
        },
        [blockchain],
    );

    console.log({blocks})

    return (
        <div className="App">
            <table id="table">
                <thead>
                    <tr>
                        <td>Index</td>
                        <td>Hash</td>
                        <td>Transaction</td>
                    </tr>
                </thead>
                <tbody>
                    {blocks.map((block, index) => {
                        return (
                            <tr key={block.hash}>
                                <td>{index}</td>
                                <td>{block.hash}</td>
                                <td>{JSON.stringify(block.transactions)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div>
                <button
                    onClick={() => {
                        addTransaction({
                            data: {
                                from: 'rens',
                                to: 'pim',
                                amount: 10,
                            },
                            type: TransactionType.Transfer,
                        });
                    }}
                >
                    Transfer money
                </button>

                <button
                    onClick={() => {
                        addTransaction({
                            data: {
                                name: 'rens-wallet',
                            },
                            type: TransactionType.CreateWallet,
                        });
                    }}
                >
                    Create account
                </button>

                <button onClick={mine}>Start mining</button>
            </div>
        </div>
    );
}

export default App;
