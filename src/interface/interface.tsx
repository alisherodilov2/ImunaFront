export interface TypeState {
    isSuccess?: boolean;
    clientGet?: boolean;
    doctor?: any;
    medicineTypeData?: any;
    complaintTarget?: any;
    diagnosisTarget?: any;
    patientComplaintData?: any;
    home_tab?: any;
    patientDiagnosisData?: any;
    cashRegModal?: boolean;
    cashRegModal2?: boolean;
    product_property?: any;
    productOrderData?: any;
    roomData?: any;
    cashRegItem?: any;
    cashRegItem2?: any;
    debtClientData?: any;
    data?: any;
    target_branch?: any;
    update?: any;
    referringDoctorData?: any;
    in_payment_value?: any;
    graph_achive_target?: any;
    graph_achive?: any;
    inPaymentData?: any;
    diagnosis_value?: any;
    expenseData?: any;
    customerData?: any;
    treatmentData?: any;
    doctorTemplateData?: any;
    advertisementsData?: any;
    materialExpenseData?: any;
    productReceptionData?: any;
    pharmacyProductData?: any;
    productCategoryData?: any;
    expenseTypeData?: any;
    departmentData?: any;
    statisticaData?: any;
    templateData?: any;
    templateCategoryData?: any;
    graphData?: any;
    client_graph_achive_target?: any;
    serviceTypeData?: any;
    check_print_data?: any;
    clientData?: any;
    payOfficeData?: any;
    masterData?: any;
    klinkaData?: any;
    usersData?: any;
    currencyData?: any;
    categoryData?: any;
    tgGroupData?: any;
    storageData?: any;
    container_value?: any;
    service_value?: any;
    doctorsData?: any;
    unityData?: any;
    pageLimit?: any;
    diagnosisData?: any;
    managerData?: any;
    referrerData?: any;
    IncomePage?: number;
    screen?: boolean;
    incomeData?: any;
    costData?: any;
    containerData?: any;
    notificationData?: any;
    page?: any;
    serachText?: string;
    serachData?: any;
    isSuccessApi?: boolean;
    isLoadingRepot?: boolean;
    index?: number;
    isLoading?: boolean;
    readOnly?: boolean;
    sendLoading?: boolean;
    hasError?: any;
    code?: any;
    brendData?: any;
    serviceData?: any;
    repot?: any;
    modelClass?: any;
    branch_ids?: any;
    user_service_situations?: any;
    product_value?: any;
    userHistoryData?: any;
    massage?: any;
    productData?: any;
    orderFindUser?: any;
    orderData?: any;
    token?: string;
    user?: any;
    findData?: any;
    bookingData?: any;
    branchData?: any;
    serviceCategoryData?: any;
    customerPaymentData?: any;
    userData?: any;
    menu?: boolean
    dark?: boolean
    userCheck?: boolean
    userCheckLoad?: boolean
    loading?: boolean
}
// Reducer type
export interface ReducerType {
    MenuReducer: TypeState
    MedicineTypeReducer: TypeState
    PatientComplaintReducer: TypeState
    PatientDiagnosisReducer: TypeState
    ProductReceptionReducer: TypeState
    ProductOrderReducer: TypeState
    PharmacyProductReducer: TypeState
    MaterialExpenseReducer: TypeState
    ReferringDoctorReducer: TypeState
    AdvertisementsReducer: TypeState
    RoomReducer: TypeState
    DoctorTemplateReducer: TypeState
    ExpenseTypeReducer: TypeState
    ExpenseReducer: TypeState
    TemplateReducer: TypeState
    TreatmentReducer: TypeState
    ClientReducer: TypeState
    ProductCategoryReducer: TypeState
    GraphReducer: TypeState
    TemplateCategoryReducer: TypeState
    PayOfficeReducer: TypeState
    DepartmentReducer: TypeState
    KlinkaReducer: TypeState
    TgGroupReducer: TypeState
    InPaymentReducer: TypeState
    CustomerReducer: TypeState
    ServiceTypeReducer: TypeState
    CategoryReducer: TypeState
    CurrencyReducer: TypeState
    StorageReducer: TypeState
    UnityReducer: TypeState
    ContainerReducer: TypeState
    ReferrerReducer: TypeState
    DoctorsReducer: TypeState
    DiagnosisReducer: TypeState
    CustomerPaymentReducer: TypeState
    ProfileReducer: TypeState
    BranchReducer: TypeState
    ServiceCategoryReducer: TypeState
    UserReducer: TypeState
    ProductReducer: TypeState
    OrderReducer: TypeState
    CrudClass: TypeState
    StatisticaReducer: TypeState
    NotificationReducer: TypeState
    MasterReducer: TypeState
    CostReducer: TypeState
    ServiceReducer: TypeState
    BrendReducer: TypeState
    ManagerReducer: TypeState
}
type MyFunctionType = (state?: any, payload?: any) => any
interface options {
    url?: string,
    responseObjectName?: string,
    method?: string,
    data?: any
}
export interface CrudInterface {
    apiSend?: (options?: options) => void
    store?: (state?: any, payload?: any) => void
    crud?: (state?: any, payload?: any) => void
    delete?: (state: any, payload: any) => void
    update?: (state: any, payload: any) => void
    show?: (state: any, payload: any) => void
    apiCrud?: (builder: any, functions: any) => void
    modelClass: any;
    payload: any;
}
// buttont interface
export interface NewButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    type?: any;
    onClick?: any

}
// buttont interface
export interface NewButtonLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
    to?: string;
}

// inout interface
export interface NewInputProps extends React.HTMLAttributes<HTMLInputElement> {
    type?: string
    placeholder?: string
    min?: any
    complateComponet?: any
    setTextComponet?: any
    max?: any,
    name?: string
    readOnly?: boolean
    disabled?: boolean
    open?: boolean
    setOpen?: Function
    required?: boolean
    error?: string
    defaultValueImg?: string
    value?: any
    setFileResult?: any
    checked?: boolean
}
export interface NewLabelProps extends React.HTMLAttributes<HTMLLabelElement> {
}
export interface NewDivProps extends React.HTMLAttributes<HTMLDivElement> {
    name?: string;
    allCheckId?: string;
    placeholder?: string;
    scrollRole?: boolean;
    extraButtonRole?: boolean;
    allCheckRoleFun?: Function;
    extraTrFunction?: Function;
    showRole?: boolean;
    localFunction?: boolean;
    localEdit?: boolean;
    localDelete?: boolean;
    paginationRole?: boolean;
    reloadData?: boolean;
    page?: number;
    rowSpan?: number;
    rowSpanRole?: boolean;
    limit?: number;
    top?: number;
    toggle?: boolean;
    extraKeys?: any;
    setNumberOfPages?: any;
    setToggle?: any;
    extraButton?: any;
    error?: string;
    dataSource?: any;
    columns?: any;
    showIcon?: any;
    editdispatchFunction?: Function;
    trConditionClassFunction?: Function;
    showFunction?: Function;
    deleteLocalFunction?: Function;
    localEditFunction?: Function;
    excelFileImportFunction?: Function;
    trClick?: Function;
    excelFileExportFunction?: Function;
    reloadDataFunction?: Function;
    deletedispatchFunction?: any;
    editRole?: boolean;
    deleteRole?: boolean;
    isSuccess?: boolean;
    isLoading?: boolean;
    errorMassage?: any;
    options?: any;
    checkbox?: boolean;
    checkboxResult?: any
    uploadFile?: boolean
    exportFile?: any
    importFile?: any
}

export interface NewSelectProps extends React.HTMLAttributes<HTMLSelectElement> {
    name?: string;
    error?: string;
    placeholder?: string;
    value?: any;
    required?: boolean
    disabled?: boolean
    dataSource?: any;
    columns?: any;
    editdispatchFunction?: Function;
    deletedispatchFunction?: any;
    editRole?: boolean;
    deleteRole?: boolean;
    isSuccess?: boolean;
    isLoading?: boolean;
    errorMassage?: any;
    options?: any;

}
export interface NewSpanProps extends React.HTMLAttributes<HTMLDivElement> {
    placeholder?: any
}

