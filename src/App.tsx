import React, { useState } from 'react';
import sha256 from 'crypto-js/sha256';
import crypto from 'crypto';
import './App.css';

interface Block {
    nonce: string;
    prevHash?: string;
    hash: string;
    isGenesis: boolean;
    transaction: Transaction;
}

enum TransactionType {
    Transfer,
    CreateWallet,
}

interface Wallet {
    name: string;
}

interface TransferTransactionData {
    from: string;
    to: string;
    amount: number;
}

interface CreateWalletTransactionData {
    name: string;
}

interface Transaction {
    data: TransferTransactionData | CreateWalletTransactionData;
    type: TransactionType;
}

interface Blockchain {
    blocks: Block[];
}

// const blockchain: Blockchain = {
//     blocks: [],
// };

function App() {
    const [blocks, setBlocks] = useState<Block[]>([]);

    const addBlock = (transaction: Transaction) => {
        console.log('addBlock');

        setBlocks((oldBlocks) => {
            const isGenesis = oldBlocks.length === 0;
            const prevBlock = oldBlocks[oldBlocks.length - 1];

            const nonce = crypto.randomBytes(20).toString('hex');

            const hash = sha256(JSON.stringify(transaction) + nonce).toString();

            const newBlock = {
                nonce,
                prevHash: prevBlock?.hash,
                hash,
                isGenesis,
                transaction,
            }

            return [...oldBlocks, newBlock];
        });
    };

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
                                <td>{JSON.stringify(block.transaction)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div>
                <button
                    onClick={() => {
                        addBlock({
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
                        addBlock({
                            data: {
                                name: 'rens-wallet',
                            },
                            type: TransactionType.CreateWallet,
                        });
                    }}
                >
                    Create account
                </button>
            </div>
        </div>
    );
}

export default App;
