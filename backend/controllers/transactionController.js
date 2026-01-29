import { supabase } from "../config/database.js";

export const createTransaction = async (req, res) => {
  try {
    const { user_id, trn_type, trn_amount, trn_description, trn_made_time } = req.body;

    const transactionData = {
        user_id,    
        trn_type,
        trn_amount,
        trn_description,
        trn_made_time
    };
    if (!user_id || !trn_type || !trn_amount || !trn_made_time) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }
    const { data: newTransaction, error } = await supabase
      .from("transaction")
      .insert([transactionData]) // insert expects an array
      .select()
      .single();

    if (error) {
      console.error("Database insert error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create transaction",
      });
    }
    
    // SUCCESS RESPONSE
    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: newTransaction,
    });

  } catch (error) {
    console.error("Error creating transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create transaction",
    });
  }
};