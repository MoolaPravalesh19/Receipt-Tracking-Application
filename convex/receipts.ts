import {v} from "convex/values";
import {mutation,query} from "./_generated/server"; 

export const generateUploadUrl=mutation({
    args:{},
    handler:async(ctx)=>{
        return await ctx.storage.generateUploadUrl();
    },
});

export const storeReceipt=mutation({
    args:{
        userId:v.string(),
        fileId:v.id("_storage"),
        fileName:v.string(),
        size:v.number(),
        mimeType:v.string(),
    },
    handler:async(ctx, args)=>{
        const receiptId=await ctx.db.insert("receipts",{
            userId:args.userId,
            filename:args.fileName,
            fileId:args.fileId,
            uploadedAt:Date.now(),
            size:args.size,
            mimeType:args.mimeType,
            status:"pending",
            merchantName:undefined,
            merchantAddress:undefined,
            merchantContact:undefined,
            transactionDate:undefined,
            transactionAmount:undefined,
            currency:undefined,
            items:[],
        });
        return receiptId;
    },
});
export const getReceipts=query({
    args:{
        userId:v.string(),
    },
    handler:async(ctx, args)=>{
        return await ctx.db
        .query("receipts")
        .filter(q => q.eq(q.field("userId"), args.userId))
        .order("desc")
        .collect();
    },
});

//Function to get a single receipt by ID
export const getReceiptById=query({
    args:{
        receiptId:v.id("receipts"),
    },
    handler:async(ctx, args)=>{
        const receipt=await ctx.db.get(args.receiptId);
        if(receipt) {
            const identity=await ctx.auth.getUserIdentity();
            if(!identity) {
                throw new Error("Unauthorized access");
            }
            const userId=identity.subject;
            if(receipt.userId !== userId) {
                throw new Error("You do not have permission to access this receipt");
            }
        }
        return receipt;
    },
});

export const getReceiptDownloadUrl=query({
    args:{
        fileId:v.id("_storage"),
    },
    handler:async(ctx,args)=>{
        return await ctx.storage.getUrl(args.fileId);
    },
});

export const updateReceiptStatus=mutation({
    args:{
        id:v.id("receipts"),
        status:v.string(),
    },
    handler:async(ctx,args)=>{
        const receipt=await ctx.db.get(args.id);
        if(!receipt){
            throw new Error("Receipt not found");
        }
        const identity=await ctx.auth.getUserIdentity();
        if(!identity) {
            throw new Error("Unauthorized access");
        }
        const userId=identity.subject;
        if(receipt.userId !== userId) {
            throw new Error("You do not have permission to update this receipt");
        }
        await ctx.db.patch(args.id, {
            status:args.status,
        });
        return true;
    },
});

export const deleteReceipt=mutation({
    args:{
        id:v.id("receipts"),
    },
    handler:async(ctx,args)=>{
        const receipt=await ctx.db.get(args.id);
        if(!receipt){
            throw new Error("Receipt not found");
        }
        const identity=await ctx.auth.getUserIdentity();
        if(!identity) {
            throw new Error("Unauthorized access");
        }
        const userId=identity.subject;
        if(receipt.userId !== userId) {
            throw new Error("You do not have permission to delete this receipt");
        }
        await ctx.storage.delete(receipt.fileId);
        await ctx.db.delete(args.id);
        return true;
    }, 
});

export const updateReiptWithExtractedData=mutation({
    args:{
        id:v.id("receipts"),
        fileDisplayName:v.string(),
        merchantName:v.string(),
        merchantAddress:v.string(),
        merchantContact:v.string(),
        transactionDate:v.string(),
        transactionAmount:v.string(),
        currency:v.string(),
        receiptSummary:v.string(),
        items:v.array(
            v.object({
              name:v.string(),
              quantity:v.number(),
              unitPrice:v.number(),
              totalPrice:v.number(),
            })
        ),
    },
    handler:async(ctx,args)=>{
        const receipt=await ctx.db.get(args.id);
        if(!receipt){
            throw new Error("Receipt not found");
        }
        await ctx.db.patch(args.id, {
            fileDisplayName:args.fileDisplayName,
            merchantName:args.merchantName,
            merchantAddress:args.merchantAddress,
            merchantContact:args.merchantContact,
            transactionDate:args.transactionDate,
            transactionAmount:args.transactionAmount,
            currency:args.currency,
            receiptSummary:args.receiptSummary,
            items:args.items,
            status:"processed",
        });
        return{
            userId:receipt.userId,
        }
    },
})