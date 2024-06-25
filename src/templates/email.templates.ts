export default class EmailTemplates {

  static verifyEmail(key: number) {
    return `
    <p>Welcome to VAU!</p>
    <p>To verify your account, use the key provided below:</p>
    <div style="width: 100%; display: flex; justify-content: center;">
        <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; width: 400px;">
            <div style="text-align: center;">
                <p style="font-size: 36px; font-weight: bold; color: #1f2d3d; margin: 0;">VAU</p>
                <p style="font-size: 18px; color: #3b3f44; font-family: arial, helvetica, sans-serif; margin-top: 20px;">
                    Your verification key is:
                </p>
                <div style="background-color: #0b9019; color: #ffffff; font-size: 18px; font-family: arial, helvetica, sans-serif; border-radius: 5px; padding: 10px; margin-top: 10px; display: inline-block;">
                    <strong>${key}</strong>
                </div>
            </div>
        </div>
    </div>
    <p>If you did not create an account, please ignore this email.</p>
`;
  }


  static resetPassword(key: string) {
    return `
    <p>To reset your password, use the code below:</p>
    <p style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007bff; text-align: center; text-decoration: none; border-radius: 5px;">
      ${key}
    </p>
    </p>
    <p>If you did not request a password reset, please ignore this email.</p>
    `
  }


}