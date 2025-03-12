import Profile from '../pages/profile/Profile';
// import PasswordChange from '../pages/profile/PasswordChange';
import { GrProductHunt } from 'react-icons/gr';
import TgGroup from '../pages/tg-group/TgGroup';
import Master from '../pages/masters/Master';
import Order from '../pages/order/Order';
import Customer from '../pages/custmer/Custmer';
import Klinka from '../pages/klinka/Klinka';
import Welcome from '../pages/director/welcome/Welcome';
import Services from '../pages/director/services/Services';
import Clients from '../pages/director/clients/Clients';
import Marketing from '../pages/director/marketing/Marketing';
import AccountingDepartment from '../pages/director/accounting-department/AccountingDepartment';
import Settings from '../pages/director/settings/Settings';
import Department from '../pages/director/services/department/Department';
import ServiceType from '../pages/director/services/service-type/ServiceType';
import Service from '../pages/director/services/service/Service';
import ReceptionWelcome from '../pages/reception/Welcome';
import CashRegisterWelcome from '../pages/cash_register/Welcome';
import DoctorWelcome from '../pages/doctor/Welcome';
import LaboratoryWelcome from '../pages/laboratory/Welcome';
import QueueWelcome from '../pages/queue/Welcome';
import CounterpartyWelcome from '../pages/counterparty/Welcome';
import { UsersData } from '../pages/director/users/UsersData';
import Graph from '../pages/reception/graph/Graph';
import DoctorReg from '../pages/doctor/doctor-reg/DoctorReg';
import TemplateCategory from '../pages/director/template/template-category/TemplateCategory';
import Template from '../pages/director/template/Template';
import DoctorGraph from '../pages/doctor/docor-graph/DoctorGraph';
import Payment from '../pages/doctor/payment/Payment';
import GraphAchive from '../pages/reception/treatment/GraphAchive';
import Treatment from '../pages/director/template/treatment/Treatment';
import Statistica from '../pages/director/statistica/Statistica';
import ReferringDoctor from '../pages/counterparty/referring-doctor/ReferringDoctor';
import Repot from '../pages/counterparty/report/Repot';
import CounterpartyRepot from '../pages/director/accounting-department/CounterpartyRepot';
import CounterpartyDoctorRepot from '../pages/director/accounting-department/CounterpartyDoctorRepot';
import CounterpartyClientIndex from '../pages/counterparty/counterparty-client/CounterpartyClientIndex';
import ClientViewAll from '../pages/counterparty/report/ClientViewAll';
import CounterpartyClientIndexView from '../pages/counterparty/counterparty-client/view/CounterpartyClientIndexView';
import ClientPaymentTable from '../pages/director/accounting-department/ClientPaymentTable';
import CounterpartyPaymentDesktop from '../pages/counterparty/counterparty-payment/CounterpartyPaymentDesktop';
import CounterpartyPayment from '../pages/counterparty/counterparty-payment/CounterpartyPayment';
import ExpenseType from '../pages/reception/expense-type/ExpenseType';
import Expense from '../pages/reception/expense/Expense';
import Product from '../pages/director/product-storage/product/Product';
import ProductCategory from '../pages/director/product-storage/product-category/ProductCategory';
import ProductReception from '../pages/director/product-storage/product-reception/ProductReception';
import DebtClient from '../pages/client/debt/DebtClient';
import ProductRepot from '../pages/director/product-storage/product-repot/ProductRepot';
import DiscountClient from '../pages/client/discount/DiscountClient';
import MaterialExpense from '../pages/reception/expense/material-expense/MaterialExpense';
import MaterialProductRepot from '../pages/director/product-storage/material-product-repot/MaterialProductRepot';
import RepotMaterialExpense from '../pages/director/accounting-department/expense-repot/RepotMaterialExpense';
import RepotExpense from '../pages/director/accounting-department/expense-repot/RepotExpense';
import AtHomeGraphAchive from '../pages/reception/treatment/AtHomeGraphAchive';
import Advertisements from '../pages/director/advertisements/Advertisements';
import DoctorTemplate from '../pages/doctor/doctor-template/DoctorTemplate';
import ReferringDoctorChangeArchive from '../pages/director/referring-doctor-change-archive/ReferringDoctorChangeArchive';
import User from '../pages/director/users/User';
import AllClient from '../pages/counterparty/all-client/AllClient';
import DailyRepot from '../pages/director/accounting-department/DailyRepot';
import DoctorRepot from '../pages/director/accounting-department/DoctorRepot';
import DoctorRepotShow from '../pages/director/accounting-department/DoctorRepotShow';
import Room from '../pages/director/services/room/Room';
import Statsionar from '../pages/reception/statsionar/Statsionar';
import MainWelcome from '../pages/director/welcome/MainWelcome';
import PharmacyWelcome from '../pages/pharmacy/PharmacyWelcome';
import Branch from '../pages/branch/Branch';
import ProductOrder from '../pages/director/product-storage/product-order/ProductOrder';
import PharmacyOrder from '../pages/pharmacy/PharmacyOrder';
import RemainingBranches from '../pages/pharmacy/remaining-branches/RemainingBranches';
import PharmacyProductShow from '../pages/pharmacy/PharmacyProductShow';
import ProductOrderBack from '../pages/pharmacy/ProductOrderBack';
import ReportProductAmbulatorAndTreatment from '../pages/director/product-storage/reportProductAmbulatorAndTreatment/ReportProductAmbulatorAndTreatment';
import ExcelRepot from '../pages/director/excel-repot/ExcelRepot';
import LaboratoryTemplate from '../pages/laboratory/laboratory-template/LaboratoryTemplate';
import Bloodtest from '../pages/laboratory/bloodtest/Bloodtest';
import LaboratoryClientCheck from '../pages/laboratory/laboratory-client/LaboratoryClientCheck';
import LaboratoryTemplateAdd from '../pages/laboratory/laboratory-template/LaboratoryTemplateAdd';
import LaboratoryTable from '../pages/laboratory/laboratory-table/LaboratoryTable';
import PasswordChange from '../pages/profile/PasswordChange';
import Client from '../pages/reception/register/Client';
import ClientPaymentTableStationar from '../pages/director/accounting-department/ClientPaymentTableStationar';
import DocStatsionar from '../pages/doctor/stationar/DocStatsionar';
import DocClientAll from '../pages/doctor/DocClientAll/DocClientAll';
import PatientComplaint from '../pages/doctor/patient-complaint/PatientComplaint';
import PatientDiagnosis from '../pages/doctor/patient-diagnosis/PatientDiagnosis';
import DoctorResultCheck from '../pages/doctor/doctor-reg/DoctorResultCheck';
import MedicineType from '../pages/doctor/medicine-type/MedicineType';
import ClientAddPage from '../pages/reception/register/ClientAddPage';
export const DASHBOARD_SIDEBAR_LINKS = [
    {
        label: "Klinka",
        route: '/',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['super_admin'],
        link: true,
        componet: <Klinka />
    },
    {
        label: "Filiallar",
        route: '/branch',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['super_admin'],
        link: true,
        componet: <Branch />
    },
    {
        label: "Mijozlar ",
        route: '/',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['laboratory'],
        link: true,
        componet: <LaboratoryWelcome />
    },
    {
        label: "Bosh sahifa ",
        route: '/client-check/:id',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['laboratory'],
        link: false,
        componet: <LaboratoryClientCheck />
    },
    {
        label: "Shablonlar",
        route: '/lab-template',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['laboratory'],
        link: true,
        componet: <LaboratoryTemplate />
    },
    {
        label: "Shablonlar",
        route: '/lab-template/:id',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['laboratory'],
        link: false,
        componet: <LaboratoryTemplateAdd />
    },
    {
        label: "Jadvallar",
        route: '/lab-table',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['laboratory'],
        link: true,
        componet: <LaboratoryTable />
    },

    {
        label: "Qon olish",
        route: '/bloodtest',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['laboratory'],
        link: true,
        componet: <Bloodtest />
    },
    {
        label: "Bosh sahifa ",
        route: '/',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director'],
        link: true,
        componet: <MainWelcome />
    },
    {
        label: "Bug'alteriya ",
        route: '/excel-repot',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director'],
        link: true,
        roleCondition: [
            {
                role: 'director',
                condition: 'is_excel_repot',
            }
        ],
        componet: <ExcelRepot />
    },
    // {
    //     label: "Statistica ",
    //     route: '/statistica',
    //     icon: <i className="menu-icon tf-icons bx bx-group" />,
    //     role: ['director'],
    //     link: true,

    //     componet: <Statistica />
    // },
    {
        label: "Xizmatlar ",
        route: '/services',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director'],
        link: true,
        componet: <Services />,
        children: [
            {
                label: "Bo'limlar",
                route: '/department',
                icon: <i className="menu-icon tf-icons bx bx-customize" />,
                role: ['admin'],
                link: true,
                componet: <Department />
            },
            {
                label: "Xonalar",
                route: '/room',
                icon: <i className="menu-icon tf-icons bx bx-customize" />,
                role: ['admin'],
                link: true,
                componet: <Room />
            },
            {
                label: "Xizmat turlari",
                route: '/service-type',
                icon: <i className="menu-icon tf-icons bx bx-customize" />,
                role: ['admin'],
                link: true,
                componet: <ServiceType />
            },
            {
                label: "Xizmat turlari",
                route: '/service-type/:id',
                icon: <i className="menu-icon tf-icons bx bx-customize" />,
                role: ['admin'],
                link: false,
                componet: <ServiceType />
            },
            {
                label: "Xizmatlar",
                route: '/service',
                icon: <i className="menu-icon tf-icons bx bx-customize" />,
                role: ['admin'],
                link: true,
                componet: <Service />
            },
            {
                label: "Xizmatlar",
                route: '/service/:department_id/:servicetype_id',
                icon: <i className="menu-icon tf-icons bx bx-customize" />,
                role: ['admin'],
                link: false,
                componet: <Service />
            },
        ]
    },
    {
        label: "Foydalanuvchilar ",
        route: '/user',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director'],
        link: true,
        componet: <User />
    },
    {
        label: "Mijozlar ",
        route: '/clients',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director'],
        link: true,
        componet: <Clients />
    },
    {
        label: "Marketing ",
        route: '/marketing',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director'],
        link: true,
        roleCondition: [
            {
                role: 'director',
                condition: 'is_marketing',
            }
        ],
        componet: <Marketing />
    },
    {
        label: "Bosh sahifa ",
        route: '/',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['cash_register'],
        link: true,
        componet: <CashRegisterWelcome />
    },
    {
        label: "Hisob bo'limi ",
        route: '/accounting-department/pay-all/client',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director', 'reception'],
        link: false,
        componet: <ClientPaymentTable />
    },
    {
        label: "Hisob bo'limi ",
        route: '/accounting-department/pay-all/stationar-client',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director', 'reception'],
        link: false,
        componet: <ClientPaymentTableStationar />
    },
    {
        label: "Hisob bo'limi ",
        route: '/accounting-department/material-expense',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director', 'reception'],
        link: false,
        componet: <RepotMaterialExpense />
    },
    {
        label: "Hisob bo'limi ",
        route: '/accounting-department/expense',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director', 'reception'],
        link: false,
        componet: <RepotExpense />
    },
    {
        label: "Sozlamalar ",
        route: '/settings',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director'],
        link: true,
        componet: <Settings />
    },

    {
        label: "Ombor ",
        route: '/product-storage/category',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director', 'reception'],
        link: false,
        componet: <ProductCategory />
    },
    {
        label: "Ombor ",
        route: '/product-storage/order',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director', 'reception'],
        link: false,
        componet: <ProductOrder />
    },
    {
        label: "Ombor ",
        route: '/product-storage/repot-order',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director', 'reception'],
        link: false,
        componet: <ReportProductAmbulatorAndTreatment />
    },
    {
        label: "Ombor ",
        route: '/product-storage/reception',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director', 'reception'],
        link: false,
        componet: <ProductReception />
    },
    {
        label: "Ombor ",
        route: '/product-storage/repot',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director', 'reception'],
        link: false,
        componet: <ProductRepot />
    },
    {
        label: "Ombor ",
        route: '/product-storage/material-repot',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director', 'reception'],
        link: false,
        componet: <MaterialProductRepot />
    },


    {
        label: "Bosh sahifa ",
        route: '/',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['reception'],
        link: true,
        componet: <ReceptionWelcome />
    },
    {
        label: "Bosh sahifa ",
        route: '/register',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['reception'],
        link: false,
        componet: <ClientAddPage />
    },
    {
        label: "Bosh sahifa ",
        route: '/',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['pharmacy'],
        link: true,
        componet: <PharmacyWelcome />
    },
    {
        label: "Bosh sahifa ",
        route: '/pharmacy-product/:id',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['pharmacy'],
        link: false,
        componet: <PharmacyProductShow />
    },
    {
        label: "Buyurtmalar ",
        route: '/order',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['pharmacy'],
        link: true,
        componet: <PharmacyOrder />
    },
    {
        label: "Qaytarilganlar ",
        route: '/repet',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['pharmacy'],
        link: true,
        componet: <ProductOrderBack />
    },
    {
        label: "Filiallardagi qoldiqlar ",
        route: '/remaining-branches',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['pharmacy'],
        link: true,
        componet: <RemainingBranches />
    },
    {
        label: "Statsionar ",
        route: '/statsionar',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['reception', 'director'],
        link: true,
        roleSettingCondition: [
            {
                role: 'reception',
                condition: 'is_reg_nav_statsionar',
            }
        ],
        componet: <Statsionar />
    },

    {
        label: "Grafik",
        route: '/graph',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['reception'],
        roleCondition: [
            {
                role: 'reception',
                condition: 'is_cash_reg',
            }
        ],
        roleSettingCondition: [
            {
                role: 'reception',
                condition: 'is_reg_nav_graph',
            }
        ],
        link: true,
        componet: <Graph />
    },
    {
        label: "Muolaja",
        route: '/grah-achive',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['reception'],
        link: true,
        roleSettingCondition: [
            {
                role: 'reception',
                condition: 'is_reg_nav_treatment',
            }
        ],
        componet: <GraphAchive />
    },
    {
        label: "Uyda",
        route: '/at-home-grah-achive',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['reception'],
        link: true,
        roleSettingCondition: [
            {
                role: 'reception',
                condition: 'is_reg_nav_at_home',
            }
        ],
        componet: <AtHomeGraphAchive />
    },
    {
        label: "Ombor ",
        route: '/product-storage/product',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director', 'reception'],
        link: true,
        roleSettingCondition: [
            {
                role: 'reception',
                condition: 'is_reg_nav_storage',
            }
        ],
        componet: <Product />
    },
    {
        label: "Xarajat turi",
        route: '/expense-type',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['reception'],
        link: false,
        roleSettingCondition: [
            {
                role: 'reception',
                condition: 'is_reg_nav_expense',
            }
        ],
        componet: <ExpenseType />
    },
    {
        label: "Xarajatlar",
        route: '/expense',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['reception'],
        link: true,
        roleCondition: [
            {
                role: 'reception',
                condition: 'is_cash_reg'
            }
        ],
        roleSettingCondition: [
            {
                role: 'reception',
                condition: 'is_reg_nav_expense',
            }
        ],
        componet: <Expense />
    },
    {
        label: "Xarajatlar",
        route: '/material-expense',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['reception'],
        link: false,
        roleSettingCondition: [
            {
                role: 'reception',
                condition: 'is_reg_nav_expense',
            }
        ],
        componet: <MaterialExpense />
    },
    {
        label: "Hisob bo'limi ",
        route: '/accounting-department',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director', 'reception', 'cash_register'],
        link: true,
        roleCondition: [
            {
                role: 'reception',
                condition: 'is_cash_reg'
            }
        ],
        roleSettingCondition: [
            {
                role: 'reception',
                condition: 'is_reg_nav_report',
            }
        ],
        componet: <AccountingDepartment />
    },


    {
        label: "Bosh sahifa ",
        route: '/customer/waiting/:id',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['doctor'],
        link: false,
        componet: <DoctorResultCheck />
    },
    {
        label: "Bosh sahifa ",
        route: '/customer/in_room/:id',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['doctor'],
        link: false,
        componet: <DoctorResultCheck />
    },

    {
        label: "Bosh sahifa ",
        route: '/customer/finish/:id',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['doctor'],
        link: false,
        componet: <DoctorResultCheck />
    },
    {
        label: "Bosh sahifa ",
        route: '/',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['doctor'],
        link: true,
        componet: <DoctorWelcome />
    },
    {
        label: "Grafik ",
        route: '/graph',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['doctor'],
        link: true,

        componet: <DoctorGraph />
    },

    {
        label: "Tolovlar ",
        route: '/payment',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['doctor'],
        link: true,
        condition: 'is_payment',
        componet: <Payment />
    },

    {
        label: "Bosh sahifa ",
        route: '/',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['queue'],
        link: true,
        componet: <QueueWelcome />
    },
    {
        label: "Bosh sahifa ",
        route: '/',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['counterparty'],
        link: true,
        componet: <CounterpartyWelcome />
    },

    {
        label: "Shablonlar ",
        route: '/template',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director'],
        link: true,
        roleCondition: [
            {
                role: 'director',
                condition: 'is_template',
            }
        ],
        componet: <Services />,
        children: [
            {
                label: "Kategoriyalar",
                route: '/category',
                icon: <i className="menu-icon tf-icons bx bx-customize" />,
                role: ['admin'],
                link: true,
                componet: <TemplateCategory />
            },
            {
                label: "Shablonlar",
                route: '/template/all',
                icon: <i className="menu-icon tf-icons bx bx-customize" />,
                role: ['admin'],
                link: true,
                componet: <Template />
            },
            {
                label: "Muolaja",
                route: '/treatment',
                icon: <i className="menu-icon tf-icons bx bx-customize" />,
                role: ['admin'],
                link: true,
                componet: <Treatment />
            },

        ]
    },

    {
        label: "Shifokorlar ",
        route: '/referring-doctor',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['counterparty'],
        link: true,
        componet: <ReferringDoctor />
    },
    {
        label: "Hisobot ",
        route: '/repot',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['counterparty'],
        link: true,
        componet: <Repot />
    },
    {
        label: "Hisobot ",
        route: '/repot/:id',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['counterparty'],
        link: false,
        componet: <ClientViewAll />
    },
    {
        label: "Tolovlar ",
        route: '/counterparty-payment',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['counterparty'],
        link: true,
        componet: <CounterpartyPayment />
    },
    {
        label: "Hisobot ",
        route: '/counterparty',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director', 'reception'],
        link: false,
        componet: <CounterpartyRepot />
    },
    {
        label: "Hisobot ",
        route: '/counterparty/:id',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director', 'reception'],
        link: false,
        componet: <CounterpartyDoctorRepot />
    },
    {
        label: "Mijozlar ",
        route: '/counterparty-client/',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['counterparty'],
        link: true,
        componet: <CounterpartyClientIndex />
    },
    {
        label: "Mijozlar ",
        route: '/counterparty-client/:id',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['counterparty'],
        link: false,
        componet: <CounterpartyClientIndexView />
    },
    {
        label: "Umumiy Mijozlar ",
        route: '/all-client',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['counterparty'],
        link: true,
        componet: <AllClient />
    },
    {
        label: "Profile",
        route: '/profile/password-change',
        link: false,
        role: ['super_admin', 'director', 'reception', 'cash_register', 'super_admin', 'doctor', 'laboratory', 'counterparty', 'pharmacy'],
        icon: <GrProductHunt />,
        componet: <PasswordChange />
    },
    // {
    //     label: "Mijozlar",
    //     route: '/customer',
    //     icon: <i className="menu-icon tf-icons bx bx-user" />,
    //     role: ['admin'],
    //     link: true,
    //     componet: <Customer />
    // },
    // {
    //     label: "Ustalar",
    //     route: '/master',
    //     icon: <i className="menu-icon tf-icons bx bx-user-circle" />,
    //     role: ['admin'],
    //     link: true,
    //     componet: <Master />
    // },
    // {
    //     label: "Buyurtmalar",
    //     route: '/order',
    //     icon: <i className="menu-icon tf-icons bx bx-basket" />,
    //     role: ['admin'],
    //     link: true,
    //     componet: <Order />
    // },
    // {
    //     label: "Asosiy",
    //     route: '/profile',
    //     icon: <i className="menu-icon tf-icons bx bx-home-alt" />,
    //     role: ['admin'],
    //     link: false,
    //     componet: <Profile />
    // },

    // {
    //     label: "Ombor",
    //     route: '/1',
    //     icon: <i className="menu-icon tf-icons bx bx-category" />,
    //     role: ['admin'],
    //     link: true,
    //     componet: <ServiceAdd />,
    //     children: [
    //         {
    //             label: "Kategoriya",
    //             route: '/category',
    //             icon: <i className="menu-icon tf-icons bx bx-customize" />,
    //             role: ['admin'],
    //             link: true,
    //             componet: <Category />
    //         },
    //         {
    //             label: "Mahsulot",
    //             route: '/product',
    //             icon: <i className="menu-icon tf-icons bx bx-target-lock" />,
    //             role: ['admin'],
    //             link: true,
    //             componet: <Product />
    //         },
    //         {
    //             label: "Birlik",
    //             route: '/unity',
    //             icon: <i className="menu-icon tf-icons bx bx-layout" />,
    //             role: ['admin'],
    //             link: true,
    //             componet: <Unity />
    //         },

    //     ]
    // },
    // {
    //     label: "Mijozlar",
    //     route: '/custmer',
    //     icon: <i className="menu-icon tf-icons bx bx-group" />,
    //     role: ['admin'],
    //     link: true,
    //     componet: <Custmer />
    // },
    // {
    //     label: "Kirim & Chiqim",
    //     route: '/in-payment',
    //     icon: <i className="menu-icon tf-icons bx bx-sort-down" />,
    //     role: ['admin'],
    //     link: true,
    //     componet: <InPayment />
    // },
    // {
    //     label: "Kirim & Chiqim",
    //     route: '/in-payment/create',
    //     icon: <i className="menu-icon tf-icons bx bx-sort-down" />,
    //     role: ['admin'],
    //     link: false,
    //     componet: <InPaymentAdd />
    // },
    // {
    //     label: "Kirim & Chiqim",
    //     route: '/in-payment/edit/:id',
    //     icon: <i className="menu-icon tf-icons bx bx-sort-down" />,
    //     role: ['admin'],
    //     link: false,
    //     componet: <InPaymentAdd />
    // },
    // {
    //     label: "Chiqim",
    //     route: '/out-payment',
    //     icon: <i className="menu-icon tf-icons bx bx-sort-up" />,
    //     role: ['admin'],
    //     link: true,
    //     componet: <InPayment />
    // },


    // {
    //     label: "Kassa",
    //     route: '/kassa',
    //     icon: <i className="menu-icon tf-icons bx bx-store" />,
    //     role: ['admin'],
    //     link: true,
    //     componet: <ServiceAdd />
    // },
    // {
    //     label: "To'lovlar",
    //     route: '/payments',
    //     icon: <i className="menu-icon tf-icons bx bx-money" />,
    //     role: ['admin'],
    //     link: false,
    //     componet: <InPayment />
    // },
    // {
    //     label: "Hisobot",
    //     route: '/repot',
    //     icon: <i className="menu-icon tf-icons bx bx-bar-chart" />,
    //     role: ['admin'],
    //     link: true,
    //     componet: <Repot />
    // },
    // {
    //     label: "Hisobot",
    //     route: '/repot/detail/:id',
    //     icon: <i className="menu-icon tf-icons bx bx-bar-chart" />,
    //     role: ['admin'],
    //     link: false,
    //     componet: <RepotDetail />
    // },
    // {
    //     label: "Sozlamalar",
    //     route: '/setting',
    //     icon: <i className="menu-icon tf-icons bx bx-cog" />,
    //     role: ['admin'],
    //     link: true,
    //     componet: <ServiceAdd />,
    //     children: [
    //         {
    //             label: "Menejer",
    //             route: '/manager',
    //             icon: <i className="menu-icon tf-icons bx bx-user" />,
    //             role: ['admin'],
    //             link: true,
    //             componet: <Manager />
    //         },
    //         {
    //             label: "Obyekt",
    //             route: '/branch',
    //             icon: <i className="menu-icon tf-icons bx bx-target-lock" />,
    //             role: ['admin'],
    //             link: true,
    //             componet: <Branch />
    //         },
    //         {
    //             label: "Valuta kursi",
    //             route: '/currency',
    //             icon: <i className="menu-icon tf-icons bx bx-equalizer" />,
    //             role: ['admin'],
    //             link: true,
    //             componet: <Currency />
    //         },
    //         {
    //             label: "Kassa",
    //             route: '/pay-office',
    //             icon: <i className="menu-icon tf-icons bx bx-equalizer" />,
    //             role: ['admin'],
    //             link: true,
    //             componet: <PayOffice />
    //         },
    //     ]
    // },
    // {
    //     label: "Ombor",
    //     route: '/storage',
    //     icon: service,
    //     role: ['admin'],
    //     link: true,
    //     comment: <Storage />
    // },
    // {
    //     label: "Ombor",
    //     link: false,
    //     role: ['admin'],
    //     route: '/storage/create',
    //     icon: <MdOutlineAddHome />,
    //     comment: <StorageAdd />
    // },
    // {
    //     label: "Ombor",
    //     link: false,
    //     role: ['admin',],
    //     route: '/storage/edit/:id',
    //     icon: <MdOutlineAddHome />,
    //     comment: <StorageAdd />
    // },
    // {
    //     label: "Birlik",
    //     route: '/unity',
    //     icon: service,
    //     role: ['admin'],
    //     link: true,
    //     comment: <Unity />
    // },
    // {
    //     label: "Birlik",
    //     link: false,
    //     role: ['admin'],
    //     route: '/unity/create',
    //     icon: <MdOutlineAddHome />,
    //     comment: <UnityAdd />
    // },
    // {
    //     label: "Birlik",
    //     link: false,
    //     role: ['admin',],
    //     route: '/unity/edit/:id',
    //     icon: <MdOutlineAddHome />,
    //     comment: <UnityAdd />
    // },
    // {
    //     label: "Probirka",
    //     route: '/container',
    //     icon: service,
    //     role: ['admin'],
    //     link: true,
    //     comment: <Container />
    // },
    // {
    //     label: "Probirka",
    //     link: false,
    //     role: ['admin'],
    //     route: '/container/create',
    //     icon: <MdOutlineAddHome />,
    //     comment: <ContainerAdd />
    // },
    // {
    //     label: "Probirka",
    //     link: false,
    //     role: ['admin',],
    //     route: '/container/edit/:id',
    //     icon: <MdOutlineAddHome />,
    //     comment: <ContainerAdd />
    // },
    // {
    //     label: "Tahlil",
    //     route: '/diagnosis',
    //     icon: service,
    //     role: ['admin'],
    //     link: true,
    //     comment: <Diagnosis />
    // },
    // {
    //     label: "Tahlil",
    //     link: false,
    //     role: ['admin'],
    //     route: '/diagnosis/create',
    //     icon: <MdOutlineAddHome />,
    //     comment: <DiagnosisAdd />
    // },
    // {
    //     label: "Tahlil",
    //     link: false,
    //     role: ['admin',],
    //     route: '/diagnosis/edit/:id',
    //     icon: <MdOutlineAddHome />,
    //     comment: <DiagnosisAdd />
    // },
    // {
    //     label: "Doktor",
    //     route: '/doctors',
    //     icon: service,
    //     role: ['admin'],
    //     link: true,
    //     comment: <Doctors />
    // },
    // {
    //     label: "Doktor",
    //     link: false,
    //     role: ['admin'],
    //     route: '/doctors/create',
    //     icon: <MdOutlineAddHome />,
    //     comment: <DoctorsAdd />
    // },
    // {
    //     label: "Doktor",
    //     link: false,
    //     role: ['admin',],
    //     route: '/doctors/edit/:id',
    //     icon: <MdOutlineAddHome />,
    //     comment: <DoctorsAdd />
    // },
    // {
    //     label: "Manager",
    //     route: '/manager',
    //     icon: service,
    //     role: ['admin'],
    //     link: true,
    //     comment: <Manager />
    // },
    // {
    //     label: "Doktor",
    //     link: false,
    //     role: ['admin'],
    //     route: '/manager/create',
    //     icon: <MdOutlineAddHome />,
    //     comment: <ManagerAdd />
    // },
    // {
    //     label: "Doktor",
    //     link: false,
    //     role: ['admin',],
    //     route: '/manager/edit/:id',
    //     icon: <MdOutlineAddHome />,
    //     comment: <ManagerAdd />
    // },
    // {
    //     label: "Yo'llovchi",
    //     route: '/referrer',
    //     icon: service,
    //     role: ['admin'],
    //     link: true,
    //     comment: <Referrer />
    // },
    // {
    //     label: "Doktor",
    //     link: false,
    //     role: ['admin'],
    //     route: '/referrer/create',
    //     icon: <MdOutlineAddHome />,
    //     comment: <ReferrerAdd />
    // },
    // {
    //     label: "Doktor",
    //     link: false,
    //     role: ['admin',],
    //     route: '/referrer/edit/:id',
    //     icon: <MdOutlineAddHome />,
    //     comment: <ReferrerAdd />
    // },

    // {
    //     label: "Registratsiya",
    //     route: '/service',
    //     icon: service,
    //     role: ['admin'],
    //     link: true,
    //     comment: <Service />
    // },
    // {
    //     label: "Xizmatlar",
    //     link: false,
    //     role: ['admin'],
    //     route: '/service/create',
    //     icon: <MdOutlineAddHome />,
    //     comment: <ServiceAdd />
    // },
    // {
    //     label: "Xizmatlar",
    //     link: false,
    //     role: ['admin',],
    //     route: '/service/edit/:id',
    //     icon: <MdOutlineAddHome />,
    //     comment: <ServiceAdd />
    // },
    // {
    //     label: "To’lovlar",
    //     route: '/tolov',
    //     icon: tolov,
    //     role: ['admin'],
    //     link: true,
    //     comment: <Service />
    // },
    // {
    //     label: "Tahlil natijalari",
    //     route: '/tahlil',
    //     icon: tahlil,
    //     role: ['admin'],
    //     link: true,
    //     comment: <Service />
    // },

    // {
    //     label: "Kassa",
    //     route: '/',
    //     link: true,
    //     role: ['manager'],
    //     icon: <BsShop />,
    //     comment: <OrderUser />
    // },
    // {
    //     label: "Filial",
    //     route: '/branch',
    //     link: true,
    //     role: ['admin'],
    //     icon: <MdOutlineAddHome />,
    //     comment: <Branch />
    // },
    // {
    //     label: "Filial",
    //     link: false,
    //     role: ['admin'],
    //     route: '/branch/create',
    //     icon: <MdOutlineAddHome />,
    //     comment: <BranchAdd />
    // },

    // {
    //     label: "Filial",
    //     link: false,
    //     role: ['admin',],
    //     route: '/branch/edit/:id',
    //     icon: <MdOutlineAddHome />,
    //     comment: <BranchAdd />
    // },
    // {
    //     label: "Xarajatlar",
    //     route: '/cost',
    //     link: true,
    //     role: ['admin', 'manager'],
    //     icon: <BiDollarCircle />,
    //     comment: <Cost />
    // },
    // {
    //     label: "Xarajatlar",
    //     link: false,
    //     role: ['admin', 'manager'],
    //     route: '/cost/create',
    //     icon: <MdOutlineAddHome />,
    //     comment: <CostAdd />
    // },

    // {
    //     label: "Xarajatlar",
    //     link: false,
    //     role: ['admin', 'manager'],
    //     route: '/cost/edit/:id',
    //     icon: <MdOutlineAddHome />,
    //     comment: <CostAdd />
    // },
    // {
    //     label: "Kategoriya",
    //     route: '/category',
    //     link: true,
    //     role: ['admin', 'manager'],
    //     icon: <BiCategory />,
    //     comment: <ServiceCategory />
    // },
    // {
    //     label: "Filial",
    //     link: false,
    //     route: '/category/create',
    //     role: ['admin', 'manager'],
    //     icon: <MdOutlineAddHome />,
    //     comment: <ServiceCategoryAdd />
    // },
    // {
    //     label: "Filial",
    //     link: false,
    //     route: '/category/edit/:id',
    //     role: ['admin', 'manager'],
    //     icon: <MdOutlineAddHome />,
    //     comment: <ServiceCategoryAdd />
    // },
    // {
    //     label: "Brend",
    //     route: '/brend',
    //     link: true,
    //     role: ['admin', 'manager'],
    //     icon: <BiCategory />,
    //     comment: <Brend />
    // },
    // {
    //     label: "Filial",
    //     link: false,
    //     route: '/brend/create',
    //     role: ['admin', 'manager'],
    //     icon: <MdOutlineAddHome />,
    //     comment: <BrendAdd />
    // },
    // {
    //     label: "Filial",
    //     link: false,
    //     route: '/brend/edit/:id',
    //     role: ['admin', 'manager'],
    //     icon: <MdOutlineAddHome />,
    //     comment: <BrendAdd />
    // },
    // // {
    // //     label: "Hodim",
    // //     route: '/worker',
    // //     link:true,
    // //     icon: <FaUserTie />,
    // //     comment: <Welcome />
    // // },
    // {
    //     label: "User",
    //     route: '/user',
    //     link: true,
    //     role: ['admin'],
    //     icon: <FaUserTie />,
    //     comment: <User />
    // },
    // {
    //     label: "User",
    //     route: '/user/create',
    //     role: ['admin'],
    //     link: false,
    //     icon: <FaUserTie />,
    //     comment: <UserAdd />
    // },
    // {
    //     label: "User",
    //     route: '/user/edit/:id',
    //     link: false,
    //     role: ['admin'],
    //     icon: <FaUserTie />,
    //     comment: <UserAdd />
    // },
    // {
    //     label: "User",
    //     route: '/user/history/:id',
    //     link: false,
    //     icon: <FaUserTie />,
    //     comment: <UserShowHistory />
    // },


    // {
    //     label: "Maxsuot",
    //     route: '/product',
    //     link: true,
    //     role: ['admin', 'manager'],
    //     icon: <GrProductHunt />,
    //     comment: <Product />
    // },
    // {
    //     label: "Maxsuot",
    //     route: '/product/create',
    //     link: false,
    //     role: ['admin', 'manager'],
    //     icon: <GrProductHunt />,
    //     comment: <ProductAdd />
    // },
    // {
    //     label: "Maxsuot",
    //     route: '/product/edit/:id',
    //     link: false,
    //     role: ['admin', 'manager'],
    //     icon: <GrProductHunt />,
    //     comment: <ProductAdd />
    // },
    // {
    //     label: "Kassa",
    //     route: '/sell-product/user/:id/repot',
    //     link: false,
    //     role: ['manager'],
    //     icon: <BsShop />,
    //     comment: <Report />
    // },
    // {
    //     label: "Kassa",
    //     route: '/sell-product/user/:id',
    //     link: false,
    //     role: ['admin', 'manager'],
    //     icon: <BsShop />,
    //     comment: <OrderUser />
    // },

    // {
    //     label: "Mijoz",
    //     route: '/custmer',
    //     icon: <FaUsers />,
    //     link: true,
    //     comment: <Custmer />
    // },
    // {
    //     label: "Sotuvchi",
    //     route: '/seller',
    //     link: true,
    //     // role: ['admin', 'manager'],
    //     icon: <BsShop />,
    //     comment: <Welcome />
    // },

    // {
    //     label: "Xizmat",
    //     route: '/service',
    //     role: ['admin', 'manager'],
    //     icon: <MdMiscellaneousServices />,
    //     comment: <Welcome />
    // },

    // {
    //     label: "Profile",
    //     route: '/profile',
    //     link: false,
    //     role: ['admin', 'manager'],
    //     icon: <GrProductHunt />,
    //     comment: <Profile />
    // },
    // {
    //     label: "Profile",
    //     route: '/profile/change',
    //     link: false,
    //     role: ['admin', 'manager'],
    //     icon: <GrProductHunt />,
    //     comment: <ProfileChange />
    // },

    // {
    //     label: "Hisobot",
    //     route: '/report-order',
    //     link: true,
    //     role: ['admin'],
    //     icon: <BiBarChartAlt />,
    //     comment: <ReportOrder />
    // },
    // // {
    // //     label: "Foydalanuvchi hisobot",
    // //     route: '/report-user',
    // //     link: true,
    // //     role: ['admin'],
    // //     icon: <GrProductHunt />,
    // //     comment: <UserReport />
    // // },

    // {
    //     label: "Maxsulot hisobot",
    //     route: '/report-order/order-statistics',
    //     link: false,
    //     role: ['admin'],
    //     icon: <GrProductHunt />,
    //     comment: <OrderStatistics />
    // },
    // {
    //     label: "Maxsulot hisobot",
    //     route: '/report-order/:id',
    //     link: false,
    //     role: ['admin'],
    //     icon: <GrProductHunt />,
    //     comment: <ReportOrderItems />
    // },
    // {
    //     label: "Maxsulot hisobot",
    //     route: '/report-order/:id/:item_id',
    //     link: false,
    //     role: ['admin'],
    //     icon: <GrProductHunt />,
    //     comment: <ReportOrderItems />
    // },
    // {
    //     label: "Maxsulot hisobot",
    //     route: '/notification',
    //     link: false,
    //     role: ['admin'],
    //     icon: <GrProductHunt />,
    //     comment: <Notification />
    // },
    {
        label: "Qarzdorlar",
        route: '/accounting-department/doctor',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['reception', 'director'],
        link: false,
        componet: <DoctorRepot />
    },
    {
        label: "Qarzdorlar",
        route: '/accounting-department/doctor/:id',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['reception', 'director'],
        link: false,
        componet: <DoctorRepotShow />
    },
    {
        label: "Qarzdorlar",
        route: '/accounting-department/debt',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['reception', 'director'],
        link: false,
        componet: <DebtClient />
    },
    {
        label: "Chegirma",
        route: '/accounting-department/discount',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['reception', 'director'],
        link: false,
        componet: <DiscountClient />
    },
    {
        label: "Chegirma",
        route: '/accounting-department/daily',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['reception', 'director'],
        link: false,

        componet: <DailyRepot />
    },
    {
        label: "Reklama",
        route: '/advertisements',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director'],
        link: true,
        componet: <Advertisements />
    },
    {
        label: "Ozgartirilgan shifokorlar",
        route: '/doctor-change-archive',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['director', 'counterparty'],
        link: true,
        componet: <ReferringDoctorChangeArchive />
    },
    {
        label: "Shablonlar ",
        route: '/doctor-template',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['doctor'],
        link: true,
        condition: 'is_editor',
        componet: <DoctorTemplate />
    },
    {
        label: "Shikoyat ",
        route: '/patient-complaint',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['doctor'],
        link: true,
        // condition: 'is_editor',
        componet: <PatientComplaint />
    },
    {
        label: "Diagnos ",
        route: '/patient-diagnosis',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['doctor'],
        link: true,
        // condition: 'is_editor',
        componet: <PatientDiagnosis />
    },
    {
        label: "Dori turlari ",
        route: '/medicine-type',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['doctor'],
        link: true,
        // condition: 'is_editor',
        componet: <MedicineType />
    },
    {
        label: "Mijozlar ",
        route: '/client-all',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['doctor'],
        link: true,
        componet: <DocClientAll />
    },
    {
        label: "Stationar ",
        route: '/stationar',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['doctor'],
        link: true,
        componet: <DocStatsionar />
    },
    {
        label: "Hisobot ",
        route: '/doctor-repot',
        icon: <i className="menu-icon tf-icons bx bx-group" />,
        role: ['doctor'],
        link: true,
        componet: <DoctorRepotShow />
    },

]

