// const { inputToConfig } = require("@ethereum-waffle/compiler");
const {expect, use,chai} = require("chai");
const { BigNumber } = require ("bignumber.js");
const { ethers } = require("hardhat");

describe("OilToken Contract", function(){
    let OildToken, oilToken, owner, addr1, addr2, addr3;
    const _DEFAULT_ISSUE_TOKEN = 1000000000000000000000;
    //let issuedToken = ethers.BigNumber.from(1000000000000000000000);

    beforeEach(async function(){
        [owner, addr1, addr2, ...addr3] = await ethers.getSigners(); 

        OildToken = await ethers.getContractFactory("OilToken");
        oilToken = await OildToken.deploy();
    });

    describe("Issue Token For Owner", function(){
        it("Should issuing token function", async function(){
            await oilToken.issueToken();
            //const ownerBalance = new BigNumber(0);
            const ownerBalance = await oilToken.balanceOf(owner.address);
            const decimals = ethers.BigNumber.from(10).pow(18);

            //assert(ownerBalance.eq(ethers.BigNumber.from(_DEFAULT_ISSUE_TOKEN)))
            //expect(ownerBalance).to.be.bignumber.at.most(_DEFAULT_ISSUE_TOKEN);
            expect(ownerBalance).to.equal(ethers.BigNumber.from(1000).mul(decimals));
            //ownerBalance.should.be.bignumber.equal(issuedToken.toNumber())
        })
    })

    describe("Transaction",function(){
        it("Should transfer oil token between two accounts", async function(){
            //Transfer 50 tokens from owner to addr1
            await oilToken.issueToken();
            await oilToken.transfer(addr1.address,50);
            const addr1Balance = await oilToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50);

            //Transfer 50 tokens from addr1 to addr2
            await oilToken.connect(addr1).transfer(addr2.address, 50);
            const addr2Balance = await oilToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });

        it("Should fail if sender doesn’t have enough tokens", async function () {
            await oilToken.issueToken();
            const initialOwnerBalance = await oilToken.balanceOf(owner.address);

            // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
            // `require` will evaluate false and revert the transaction.
            await expect(
                oilToken.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("Not enough tokens");

            // Owner balance shouldn't have changed.
            expect(await oilToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);

        });

        it("Should update balances after transfers", async function(){
            await oilToken.issueToken();
            //get initial owner balance
            const initialOwnerBalance = await oilToken.balanceOf(owner.address);

            await oilToken.transfer(addr1.address, 100);
            await oilToken.transfer(addr2.address, 50);
            //check balance
            const finalBalance = await oilToken.balanceOf(owner.address);
            expect(finalBalance).to.equal(initialOwnerBalance.sub(150));

            const addr1Balance  = await oilToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);

            const addr2Balance = await oilToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        })
    });

    describe("Claim token", function(){
        it("Should claim token success", async function(){
            await oilToken.issueToken();
            const ownerBalance = await oilToken.balanceOf(owner.address);
            const addr1Balance = await oilToken.balanceOf(addr1.address);

            await  oilToken.connect(addr1).claim(100);
            expect(await oilToken.balanceOf(addr1.address)).to.equal(addr1Balance.add(100));
            expect(await oilToken.balanceOf(owner.address)).to.equal(ownerBalance.sub(100));
        })
    });
});