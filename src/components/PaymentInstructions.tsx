import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, CheckCircle, AlertCircle, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentInstructionsProps {
  paymentMethod: string;
  onTransactionIdSubmit: (transactionId: string) => void;
  isSubmitting?: boolean;
}

interface PaymentAccount {
  account_title: string;
  account_number: string;
  account_type: string;
  branch_name?: string;
  swift_code?: string;
  iban?: string;
}

export default function PaymentInstructions({
  paymentMethod,
  onTransactionIdSubmit,
  isSubmitting = false,
}: PaymentInstructionsProps) {
  const [transactionId, setTransactionId] = useState("");
  const [step, setStep] = useState<"instructions" | "transaction">(
    "instructions"
  );
  const { toast } = useToast();

  // Default account details (these will be fetched from database in production)
  const paymentAccounts: Record<string, PaymentAccount> = {
    jazzcash: {
      account_title: "LUQMAN BIN RIZWAN",
      account_number: "03041146524",
      account_type: "JazzCash Mobile Wallet",
    },
    easypaisa: {
      account_title: "LUQMAN BIN RIZWAN",
      account_number: "03391146524",
      account_type: "EasyPaisa Mobile Wallet",
    },
    bank_account: {
      account_title: "SUFI SHINE",
      account_number: "03311010050044",
      account_type: "Bank Alfalah - Current Account",
      branch_name: "Rail Bazar Gujranwala Branch",
      swift_code: "ALFHPKKAXXX",
      iban: "PK68ALFH033100101005004",
    },
  };

  const currentAccount = paymentAccounts[paymentMethod];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
      duration: 2000,
    });
  };

  const handleTransactionSubmit = () => {
    if (!transactionId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid transaction ID",
        variant: "destructive",
      });
      return;
    }
    onTransactionIdSubmit(transactionId.trim());
  };

  if (!currentAccount) {
    return null;
  }

  return (
    <div className="space-y-4">
      {step === "instructions" && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {paymentMethod === "jazzcash"
                ? "JazzCash"
                : paymentMethod === "easypaisa"
                ? "EasyPaisa"
                : "Bank Transfer"}{" "}
              Payment Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please follow these steps to complete your payment:
              </AlertDescription>
            </Alert>

            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <h4 className="font-semibold">Account Details:</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex justify-between items-center p-2 bg-background rounded border">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Account Title
                    </Label>
                    <p className="font-medium">
                      {currentAccount.account_title}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        currentAccount.account_title,
                        "Account Title"
                      )
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex justify-between items-center p-2 bg-background rounded border">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Account Number
                    </Label>
                    <p className="font-medium">
                      {currentAccount.account_number}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        currentAccount.account_number,
                        "Account Number"
                      )
                    }
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-2 bg-background rounded border">
                <Label className="text-sm text-muted-foreground">
                  Account Type
                </Label>
                <p className="font-medium">{currentAccount.account_type}</p>
              </div>

              {paymentMethod === "bank_account" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentAccount.branch_name && (
                    <div className="flex justify-between items-center p-2 bg-background rounded border">
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          Branch Name
                        </Label>
                        <p className="font-medium">
                          {currentAccount.branch_name}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            currentAccount.branch_name!,
                            "Branch Name"
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {currentAccount.swift_code && (
                    <div className="flex justify-between items-center p-2 bg-background rounded border">
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          SWIFT Code
                        </Label>
                        <p className="font-medium">
                          {currentAccount.swift_code}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            currentAccount.swift_code!,
                            "SWIFT Code"
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {currentAccount.iban && (
                    <div className="flex justify-between items-center p-2 bg-background rounded border md:col-span-2">
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          IBAN
                        </Label>
                        <p className="font-medium font-mono">
                          {currentAccount.iban}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(currentAccount.iban!, "IBAN")
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Steps to Complete Payment:</h4>
              {paymentMethod === "bank_account" ? (
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    Use your bank app or visit your bank for an interbank
                    transfer
                  </li>
                  <li>
                    Enter IBAN: <strong>{currentAccount.iban}</strong> or
                    Account No: <strong>{currentAccount.account_number}</strong>
                  </li>
                  <li>Account Title: {currentAccount.account_title}</li>
                  <li>Add your Order ID in Reference/Remarks</li>
                  <li>Transfer the exact total amount</li>
                  <li>Save the Transaction/Reference ID after success</li>
                  <li>
                    Enter the Transaction ID below to confirm your payment
                  </li>
                </ol>
              ) : (
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    Open your{" "}
                    {paymentMethod === "jazzcash" ? "JazzCash" : "EasyPaisa"}{" "}
                    app
                  </li>
                  <li>Select "Send Money" or "Transfer Money"</li>
                  <li>
                    Enter the account number:{" "}
                    <strong>{currentAccount.account_number}</strong>
                  </li>
                  <li>Enter the exact amount shown in your order total</li>
                  <li>Complete the transaction</li>
                  <li>Copy the transaction ID from the success message</li>
                  <li>
                    Enter the transaction ID below to confirm your payment
                  </li>
                </ol>
              )}
            </div>

            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Important:</strong> Make sure to send the exact amount
                and save your transaction ID. Your order will be processed after
                payment verification.
              </AlertDescription>
            </Alert>

            <Button
              onClick={() => setStep("transaction")}
              className="w-full btn-spiritual"
            >
              I have made the payment
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "transaction" && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Enter Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Great! Now please enter your transaction ID to complete the
                order.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="transactionId">
                Transaction ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="transactionId"
                placeholder="Enter your transaction ID (e.g., 1234567890)"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                {paymentMethod === "bank_account"
                  ? "This is the reference/transaction number provided by your bank after the transfer."
                  : `You can find this ID in your ${
                      paymentMethod === "jazzcash" ? "JazzCash" : "EasyPaisa"
                    } app after successful payment`}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep("instructions")}
                disabled={isSubmitting}
              >
                Back to Instructions
              </Button>
              <Button
                onClick={handleTransactionSubmit}
                disabled={!transactionId.trim() || isSubmitting}
                className="flex-1 btn-spiritual"
              >
                {isSubmitting ? "Submitting..." : "Confirm Payment"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
