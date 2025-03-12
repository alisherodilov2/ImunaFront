import React from 'react'
import { formatId } from '../../../helper/idGenerate'
import { sexFunction } from '../../../helper/clientHelper'
import { date } from '../../../helper/date'

export const certificateHtml = (data: any, user?: any) => {

    const { first_name, sex, data_birth, person_id, pass_number, created_at, date_1, date_2, serial_number_2, serial_number_1, clinic_name } = data
    console.log('data', data);
    let servicename = data?.target?.client_value?.at(0)?.service?.name
    let department_id = data?.target?.client_value?.at(0)?.service?.department_id;
    let client_id = data?.target?.id
    const baseUrl = user?.setting?.result_domain;
    // const baseUrl = "https://clinic-certificate.netlify.app";
    const queryParams = `client_id=${encodeURIComponent(client_id)}`;

    // To'liq URL
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(baseUrl + "?" + queryParams)}&size=150x150`;
    let serialnum1 = serial_number_1 && serial_number_1 != 'null' ? ` 
            <span style="display: inline-block; border: 1px solid  rgb(190, 187, 187); width: 155px;">
                <span id="bg"
                    style="display: inline-block; padding: 3px 10px; border-right: 1px solid  rgb(190, 187, 187);"><b>
                        1
                    </b></span>
                <span style="display: inline-block; padding: 3px 10px;"><b>${serial_number_1 ?? '-'}</b></span>
           </span>` : '';
    let serialnum2 = serial_number_2 && serial_number_2 != 'null' ? `<span style="display: inline-block; border: 1px solid  rgb(190, 187, 187);width: 155px;">
                <span id="bg"
                    style="display: inline-block; padding: 3px 10px; border-right: 1px solid  rgb(190, 187, 187);"><b>
                        ${serialnum1.length > 0 ? '2' : '1'}
                    </b></span>
                <span style="display: inline-block; padding: 3px 10px;"><b>
                ${serial_number_2 ?? '-'}
                </b></span>
            </span>` : '';
    let serialnumdate2 = serial_number_2 && serial_number_2 != 'null' ? ` 
            <span style="display: inline-block; border: 1px solid  rgb(190, 187, 187); width: 155px;">
                <span id="bg"
                    style="display: inline-block; padding: 3px 10px; border-right: 1px solid  rgb(190, 187, 187);"><b>
                      ${serialnum1.length > 0 ? '2' : '1'}
                    </b></span>
                <span style="display: inline-block; padding: 3px 10px;"><b>
                ${date_2 ?? '-'}
                </b></span>
            </span>` : '';
    let serialnumdate1 = serial_number_1 && serial_number_1 != 'null' ? `   
            <span style="display: inline-block; border: 1px solid  rgb(190, 187, 187); width: 155px;">
                <span id="bg"
                    style="display: inline-block; padding: 3px 10px; border-right: 1px solid  rgb(190, 187, 187);"><b>
                        1
                    </b></span>
                <span style="display: inline-block; padding: 3px 10px;"><b>
                ${date_1 ?? '-'}
                </b></span>
            </span>` : '';
    return `<!DOCTYPE html>
<html lang="uz">

<head>
    <meta charset="UTF-8">
    <title>Vaksinatsiya Sertifikati</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Times New Roman', Times, serif;
            margin: 0;
            padding: 0;
            border: 2px solid black;
            height: calc(100vh - 10px);
        }

        #bg {
            background: rgb(190, 187, 187);
        }

        @media print {
            .page-break {
                page-break-before: always;
            }

            #bg {
                background: rgb(190, 187, 187);
            }

            .header,
            .footer {
                display: none;
            }

            @page {
                margin: 1rem 1rem;
            }
        }

        .certificate {

            padding: 20px;
            /* width: 600px; */
            margin: auto;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header img {
            width: 100px;
            height: auto;
        }

        .section {
            margin-bottom: 10px;
        }

        /* .section span {
            font-weight: bold;
        } */

        .qr-code {
            text-align: center;
            margin-top: 20px;
        }

        /* .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
        } */
    </style>
</head>

<body>
    <div class="certificate">
        <div class="header" style="display: flex; justify-content: space-between; align-items: center;">
            <p>
                <b>

                    O'ZBEKISTON RESPUBLIKASI<br>SOG'LIQNI SAQLASH VAZIRLIGI <br>
                    KORONAVIRUS (COVID-19) GA QARSHI<br>EMLANGANLIK TO'G'RISIDA <br> SERTIFIKAT
                </b>

            </p>
            <img src="https://i.pinimg.com/originals/32/5f/e4/325fe48a5d65ad68e71f550a30fdc682.jpg"style="width: 130px; height: auto;" alt="">
            <p>
                <b>

                    MINISTRY OF HEALTH<br>OF THE REPUBLIC OF UZBEKISTAN <br>
                    CORONAVIRUS (COVID-19)<br>VACCINATION <br> CERTIFICATE
                </b>

            </p>

        </div>
        <div class="section"><b>ID: ${formatId(person_id)}</b></div>
        <div class="section">
            <span>Emlash punkti/Место вакцинации/Place of vaccination:</span> <b>${clinic_name}</b>
            <br>
            <br>
        </div>
        <div class="section">
            <span>Vaksina turi/Тип вакцины/Type of vaccine:</span> <b>${servicename}</b><br><br>
        </div>
        <div class="section">
        <span style="display: inline-block; width: 350px;">Seriya raqami/Серийный номер/Serial number:</span>
           ${serialnum1}
           ${serialnum2}
            <br>
        </div>
        <div class="section">
<span style="display: inline-block; width: 350px;">Emlash vaqti/Время вакцинации/Vaccination date:</span>
          ${serialnumdate1} ${serialnumdate2}
            <br><br>
        </div>
        <div class="section">
            <span>Pasport seriya va raqami/Серийный номер паспорта/Passport serial number:</span> <b>
                ${pass_number}
            </b><br><br>
        </div>
        <div class="section">
            <span>To'liq ismi/Полное имя/Full name:</span> <b>${first_name}</b><br><br>
        </div>
        <div class="section">
            <span>Tug'ilgan sana/Дата рождения/Date of birth:</span> <b>${data_birth}</b><br><br>
        </div>
        <div class="section">
            <span>Jinsi/Пол/Sex:</span> <b>${sexFunction(sex)}</b><br><br>
        </div>
        <div class="section">
            <span>Berilgan sana/Дата выдачи/Date of issue:</span> <b>${date(data?.target?.created_at)}</b><br><br>
        </div>
        <br>
        
     <img src="${qrCodeUrl}"
            style="display: block; margin: 0 auto; outline: 10px solid rgb(190, 187, 187); border: 10px solid white;">
        <br>
        <br>
        <!-- <div class="qr-code">
            <img src="qr-code-placeholder.jpg" alt="QR Code" width="150">
        </div> -->
        <div style="text-align: center;">
            <p>O'zbekiston Respublikasi sanitariya-epidemiologik osoyishtalik va jamoat salomatligi xizmati</p>
            <p>Manzil: Toshkent shahar, Chilonzor tumani, Bunyodkor ko'chasi, 45</p>
            <p>Telefon: +998 71 276 40 71<br>Email: kancelyariyarecsdenm@ssv.uz</p>
        </div>
        <br>
        <p style="text-align: center;">
            2024-yil
        </p>
    </div>
</body>

</html>`
}

