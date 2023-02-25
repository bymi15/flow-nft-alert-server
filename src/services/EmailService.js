import { Service } from "typedi";
import { FLOWSCAN_URL } from "../utils/constants";
import { getAvailableMarketplaces } from "../utils/marketplaces";

const FROM_MAIL = "Flow NFT Alert <flownftalert@gmail.com>";

const viewMarketplaceButtonHTML = (url, marketplaceName) => `
<tr>
  <td style="padding-left: 15px; padding-right: 15px;">
    <a href="${url}" style="padding-top: 0.75rem; padding-bottom: 0.75rem; padding-left: 2.5rem; padding-right: 2.5rem; background-color: rgb(36 61 174); border-radius: 0.375rem; color: white; text-decoration: none; font-size: .875rem; line-height: 1.25rem; font-weight: bold;">View on ${marketplaceName}</a>
    <br />
    <br />
  </td>
</tr>
`;

@Service()
export default class EmailService {
  constructor(container) {
    this.transporter = container.get("transporter");
    this.logger = container.get("logger");
  }

  async sendListingAlertEmail({ email, data }) {
    try {
      const {
        contractName,
        contractAddress,
        name,
        description,
        thumbnailURL,
        nftID,
        salePrice,
        currency,
        transactionID,
        storefrontContractName,
        storefrontContractAddress,
        ownerAddress,
      } = data;
      const flowscanTransactionURL = `${FLOWSCAN_URL}/transaction/${transactionID}`;

      const marketplaces = getAvailableMarketplaces(
        storefrontContractName,
        storefrontContractAddress,
        contractName,
        contractAddress,
        ownerAddress,
        nftID
      );

      await this.transporter.sendMail({
        from: FROM_MAIL,
        to: email,
        subject: `Flow NFT Alert - New listing for ${name}`,
        html: `
        <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <link href="https://fonts.googleapis.com/css?family=Inter:400,400i,700,700i" rel="stylesheet">
  </head>
  <body style="width:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;font-family:'Inter', 'helvetica neue', helvetica, arial, sans-serif;padding:0;Margin:0">
    <div>
      <table cellpadding="0" cellspacing="0" class="es-wrapper" style="background-color:#333755; background-position:center top; background-repeat:repeat; border-collapse:collapse; border-spacing:0px; height:100%; margin:0px; padding:0px; width:100%">
        <tbody>
          <tr>
            <td style="vertical-align:top">
              <table align="center" cellpadding="0" cellspacing="0" class="es-content" style="border-collapse:collapse; border-spacing:0px; mso-table-lspace:0pt; mso-table-rspace:0pt; table-layout:fixed !important; width:100%">
                <tbody>
                  <tr>
                    <td>
                      <table align="center" cellpadding="0" cellspacing="0" class="es-content-body" style="background-color:transparent; border-collapse:collapse; border-spacing:0px; mso-table-lspace:0pt; mso-table-rspace:0pt; width:600px">
                        <tbody>
                          <tr>
                            <td>&nbsp; <table align="right" cellpadding="0" cellspacing="0" class="es-right" style="border-collapse:collapse; border-spacing:0px; float:right; mso-table-lspace:0pt; mso-table-rspace:0pt">
                                <tbody></tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table align="center" cellpadding="0" cellspacing="0" class="es-content" style="border-collapse:collapse; border-spacing:0px; mso-table-lspace:0pt; mso-table-rspace:0pt; table-layout:fixed !important; width:100%">
                <tbody>
                  <tr></tr>
                  <tr>
                    <td>
                      <table align="center" cellpadding="0" cellspacing="0" class="es-header-body" style="background-color:#171447; border-collapse:collapse; border-spacing:0px; mso-table-lspace:0pt; mso-table-rspace:0pt; width:600px">
                        <tbody>
                          <tr>
                            <td>
                              <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-spacing:0px; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%">
                                <tbody>
                                  <tr>
                                    <td style="vertical-align:top; width:530px">
                                      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-spacing:0px; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%">
                                        <tbody>
                                          <tr>
                                            <td>
                                              <h1 style="margin-left:0px; margin-right:0px; text-align:center">
                                                <span style="font-size:20px">
                                                  <strong>
                                                    <span style="color:#ffffff">A new listing has been posted!</span>
                                                  </strong>
                                                </span>
                                                <br />
                                                <img alt="Flow NFT Alert" src="https://flow-nft-alert.vercel.app/_next/image?url=%2Fflow-nft-alert-logo.png&amp;w=384&amp;q=75" style="height:60px; margin-top:15px; width:60px" />
                                              </h1>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table align="center" cellpadding="0" cellspacing="0" class="es-content" style="border-collapse:collapse; border-spacing:0px; mso-table-lspace:0pt; mso-table-rspace:0pt; table-layout:fixed !important; width:100%">
                <tbody>
                  <tr>
                    <td>
                      <table align="center" cellpadding="0" cellspacing="0" class="es-content-body" style="background-color:#ffffff; border-collapse:collapse; border-spacing:0px; mso-table-lspace:0pt; mso-table-rspace:0pt; width:600px">
                        <tbody>
                          <tr>
                            <td>
                              <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-spacing:0px; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%; background-color: #060B27; color: #fff">
                                <tbody>
                                  <tr>
                                    <td style="vertical-align:top; width:530px">
                                      <table cellpadding="5" cellspacing="0" style="border-collapse:collapse; border-spacing:0px; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%;">
                                        <tbody>
                                          <tr>
                                            <td style="padding-left: 15px; padding-right: 15px;">
                                              <p>
                                                <strong>Name:</strong>&nbsp;${name}
                                              </p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style="padding-left: 15px; padding-right: 15px;">
                                              <p>
                                                <strong>NFT ID:</strong>&nbsp;${nftID}
                                              </p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style="padding-left: 15px; padding-right: 15px;">
                                              <p>
                                                <strong>Description:</strong>
                                                <br /> ${description}
                                              </p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style="padding-left: 15px; padding-right: 15px;">
                                              <p>
                                                <strong>Price:&nbsp;</strong>${salePrice}&nbsp;${currency}
                                              </p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style="padding-left: 15px; padding-right: 15px;">
                                              <p>
                                                <strong>Transaction: </strong>
                                                <a href="${flowscanTransactionURL}" style="text-size-adjust: none; text-decoration-line: none; color: rgb(237, 142, 32); font-size: 15px;">${flowscanTransactionURL}</a>
                                              </p>
                                            </td>
                                          </tr>
                                          <tr>
                                            <td style="padding-left: 20px; padding-right: 20px; padding-bottom: 15px;">
                                              <img src="${thumbnailURL}" style="border:0px; display:block; outline:none; margin-bottom: 10px" />
                                            </td>
                                          </tr>
                                          ${marketplaces.map((marketplace) =>
                                            viewMarketplaceButtonHTML(
                                              marketplace.url,
                                              marketplace.name
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table align="center" cellpadding="0" cellspacing="0" class="es-content" style="border-collapse:collapse; border-spacing:0px; mso-table-lspace:0pt; mso-table-rspace:0pt; table-layout:fixed !important; width:100%">
                <tbody>
                  <tr>
                    <td>&nbsp;</td>
                  </tr>
                </tbody>
              </table>
              <table align="center" cellpadding="0" cellspacing="0" class="es-footer" style="background-position:center top; background-repeat:repeat; border-collapse:collapse; border-spacing:0px; mso-table-lspace:0pt; mso-table-rspace:0pt; table-layout:fixed !important; width:100%">
                <tbody>
                  <tr>
                    <td>
                      <table align="center" cellpadding="0" cellspacing="0" class="es-footer-body" style="background-color:#ffffff; border-collapse:collapse; border-spacing:0px; mso-table-lspace:0pt; mso-table-rspace:0pt; width:600px">
                        <tbody>
                          <tr>
                            <td>
                              <table cellpadding="0" cellspacing="0" style="border-collapse:collapse; border-spacing:0px; mso-table-lspace:0pt; mso-table-rspace:0pt; width:100%; background-color:#333755; color: #bbb; font-size: 12px;">
                                <tbody>
                                  <tr>
                                    <td>
                                      <p style="margin-left:0; margin-right:0">You are receiving this email because&nbsp;you have submitted your email address to Flow NFT Alert. If you do not wish to receive&nbsp;emails from Flow NFT Alert, please reply to this email to be unsubscribed.</p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>
        `,
      });
    } catch (err) {
      throw err;
    }
  }
}
