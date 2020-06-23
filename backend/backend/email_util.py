import os
from django.conf import settings
from django.core.mail import send_mail


DOMAIN_URL = os.getenv('DOMAIN_URL')
NOREPLY_EMAIL = os.getenv('EMAIL_NOREPLY_FROM')
FAIL_SILENTLY = os.getenv('EMAIL_FAIL_SILENTLY')

def send_password_reset_email(email, reset_code):
    reset_link = '{}/reset_password/{}'.format(DOMAIN_URL, reset_code)

    message = '''
        You’re receiving this e-mail because you requested a password reset for your Feldberg’s Cookbook account.
        Please paste this link into your browser to choose a new password: {reset_link}
    '''.format(reset_link=reset_link)

    html_message = '''
        <table cellspacing="0" cellpadding="0" border="0" width="100%" valign="top">
            <tbody>
                <tr>
                    <td style="width:600px;vertical-align:top;padding-top:32px">
                        <div style="max-width:600px;margin:0 auto; font-family:Arial, Helvetica, sans-serif">
                            <div style="padding-right:30px;padding-left:30px;padding-bottom:30px">
                                <table
                                style="background-color:#19A2B8;table-layout:fixed;border:1px solid #19A2B8;padding:0;margin-top:0px;width:100%;border-collapse:collapse;text-align:center">
                                    <tbody>
                                        <tr style="background-color:white">
                                            <td style="padding:20px 0px;text-align:center;color:#202124"
                                                valign="top">
                                                <a href="https://feldbergscookbook.com" target="_blank">
                                                    <img src="https://i.imgur.com/cOdzskx.png" width="30" height="auto"
                                                        style="width:60px;height:auto;border:0" aria-hidden="true" valign="top">
                                                </a>
                                            </td>
                                        </tr>
                                        <tr style="background-color:white">
                                            <td style="text-align:left; padding:20px;border:none">
                                                <div>You’re receiving this email because you requested a password reset for your Feldberg’s Cookbook account.</div>
                                                <br>
                                                <div>Please click the link below to choose a new password.</div>
                                                <br>
                                                <div><a href="{reset_link}">Reset Password</a></div>
                                                <br>
                                                Or copy and paste this link into your browser: {reset_link}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style="border-collapse:collapse;font-size:0px;word-break:break-word;text-align:justify">
                                                <div
                                                    style="padding:5px; font-size:10px;line-height:12px;text-align:middle;text-decoration:none;color:#fff;font-family:'Muli',Arial,sans-serif!important"
                                                >
                                                    You have received this email in association with your Feldberg’s Cookbook membership. If you believe you received this email in error please contact us at
                                                        <a style="text-decoration: none; color: #e1e1e1" href="mailto:support@feldbergscookbook.com">support@feldbergscookbook.com</a>.
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style="border-collapse:collapse;font-size:0px;word-break:break-word; text-align: center">
                                                <div
                                                    style="font-size:10px;line-height:30px;text-align:middle;text-decoration:none;color:#fff;font-family:'Muli',Arial,sans-serif!important">
                                                    © 2020 Under Development LLC
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    '''.format(reset_link=reset_link)

    send_mail(
        subject='Reset your Feldberg’s Cookbook password',
        message=message,
        html_message=html_message,
        from_email=NOREPLY_EMAIL,
        recipient_list=[email],
        fail_silently=FAIL_SILENTLY,
    )

def send_welcome_email(email):
    message = '''
        Welcome to Feldberg’s Cookbook!

        Thanks for signing up!

        Now you can:
        -Save recipes to your Favorites List
        -Create your own recipes and upload photos
        -Review, rate, and comment on recipes

        Happy cooking!

        You have received this email in association with your Feldberg’s Cookbook membership. If you believe you received this email in error please contact us at support@feldbergscookbook.com.
    '''

    html_message = '''
        <table cellspacing="0" cellpadding="0" border="0" width="100%" valign="top">
            <tbody>
                <tr>
                    <td style="width:600px;vertical-align:top;padding-top:32px">
                        <div style="max-width:600px;margin:0 auto; font-family:Arial, Helvetica, sans-serif">
                            <div style="padding-right:30px;padding-left:30px;padding-bottom:30px">
                                <table
                                style="background-color:#19A2B8;table-layout:fixed;border:1px solid #19A2B8;padding:0;margin-top:0px;width:100%;border-collapse:collapse;text-align:center">
                                    <tbody>
                                        <tr style="background-color:white">
                                            <td style="padding:20px 0px;text-align:center;color:#202124"
                                                valign="top">
                                                <a href="https://feldbergscookbook.com" target="_blank">
                                                    <img src="https://i.imgur.com/cOdzskx.png" width="30" height="auto"
                                                        style="width:60px;height:auto;border:0" aria-hidden="true" valign="top">
                                                </a>
                                            </td>
                                        </tr>
                                        <tr style="background-color:white">
                                            <td style="text-align:center; padding:20px;border:none">
                                                <h1 style="margin:0">Welcome to</h1>
                                                <h1 style="margin:0">Feldberg’s Cookbook!</h1>
                                            </td>
                                        </tr>
                                        <tr style="background-color:white">
                                            <td style="text-align:left; padding:20px">
                                                Thanks for signing up! Now you can:
                                                <ul>
                                                    <li>Save recipes to your Favorites List</li>
                                                    <li>Create your own recipes and upload photos</li>
                                                    <li>Review, rate, and comment on recipes</li>
                                                </ul>
                                                Happy cooking!
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style="border-collapse:collapse;font-size:0px;word-break:break-word;text-align:justify">
                                                <div
                                                    style="padding:5px; font-size:10px;line-height:12px;text-align:middle;text-decoration:none;color:#fff;font-family:'Muli',Arial,sans-serif!important"
                                                >
                                                    You have received this email in association with your Feldberg’s Cookbook membership. If you believe you received this email in error please contact us at
                                                        <a style="text-decoration: none; color: #e1e1e1" href="mailto:support@feldbergscookbook.com">support@feldbergscookbook.com</a>.
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style="border-collapse:collapse;font-size:0px;word-break:break-word; text-align: center">
                                                <div
                                                    style="font-size:10px;line-height:30px;text-align:middle;text-decoration:none;color:#fff;font-family:'Muli',Arial,sans-serif!important">
                                                    © 2020 Under Development LLC
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    '''

    send_mail(
        subject='Welcome to Feldberg’s Cookbook!',
        message=message,
        html_message=html_message,
        from_email=NOREPLY_EMAIL,
        recipient_list=[email],
        fail_silently=FAIL_SILENTLY,
    )
