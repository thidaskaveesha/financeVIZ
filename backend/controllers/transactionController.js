import { supabase } from "../config/database.js";

export const createTransaction = async (req, res) => {
  try {
    // 1. Extract token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    const access_token = authHeader.replace("Bearer ", "");
    // 2. Verify token & get user
    // query your OWN user table
    const { data: user, user_error } = await supabase
      .from('user')       
      .select('*')
      .eq('access_token', access_token)
      .single();

    if (user_error || !user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token" 
      });
    }

    // 3. Extract body
    const { trn_type, trn_amount, trn_description, trn_made_time } = req.body;

    if (!trn_type || !trn_amount || !trn_made_time) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // 4. Build transaction safely
    const transactionData = {
      user_id: user.user_id, 
      trn_type,
      trn_amount,
      trn_description: trn_description ?? "",
      trn_made_time,
    };

    // 5. Insert
    const { data, error } = await supabase
      .from("transaction")
      .insert(transactionData)
      .select()
      .single();

    if (error) {
      console.error("Database insert error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create transaction",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data,
    });

  } catch (error) {
    console.error("Error creating transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};