frappe.ui.form.on("Job Offer",{
    after_save: function(frm){
        frappe.call({
            method:'interview.interview.custom.python.job_offer.get_job_offer_name',
            args:{
                job : frm.doc.name,
                job_interview : frm.doc.job_interview_name
            }
        })
    },
    refresh: function(frm){
        if(frm.doc.docstatus == 1 && frm.doc.job_interview_name){
            frm.add_custom_button(__("Job Offer Terms"),function(){
                var d = new frappe.ui.Dialog({
                    title: __("Edit Job Offer Terms"),
                    fields:[
                        {
                            "label" : "Offer Term",
                            "fieldname": "offer_term",
                            "fieldtype": "Link",
                            "reqd": 1,
                            "options": "Offer Term"
                        },
                        {
                            "label" : "Value / Description",
                            "fieldname": "value",
                            "fieldtype": "Data",
                            "reqd": 1,
                        }
                    ],
                    primary_action: function(){
                        var data = d.get_values();
                        frappe.call({
                            method: 'interview.interview.custom.python.job_offer.edit_job_offer_term',
                            args : {
                                value: data.value,
                                offer_term: data.offer_term,
                                doc_name: frm.doc.name,
                            }
                        })
                        d.hide();
                    },
                    primary_action_label: __('Change')
                });
                d.show();
            },__("Edit"))
        }
        if(frm.doc.workflow_state == "Approved" && frm.doc.status == "Accepted"){
            frm.remove_custom_button(__("Create Employee"))
            frm.add_custom_button(__("Employee Creation"), function(){
                var d = new frappe.ui.Dialog({
                    title: __("Create Employee"),
                    fields:[
                        {
                            "label" : "Employee Name",
                            "fieldname": "name",
                            "fieldtype": "Data",
                            "reqd": 1,
                        },
                        {
                            "label": "Gender",
                            "fieldname": "gender",
                            "fieldtype": "Select",
                            "reqd": 1,
                            "options": ['Male','Female']
                        },
                        {
                            "fieldtype": "Column Break",
                        },
                        {
                            "label": "Date of Birth",
                            "fieldname": "date_of_birth",
                            "fieldtype": "Date",
                            "reqd": 1,
                        },
                        {
                            "label": "Date of Joining",
                            "fieldname": "date_of_joining",
                            "fieldtype": "Date",
                            "reqd": 1,
                        }
                    ],
                    primary_action: function(){
                        var data = d.get_values();
                        frappe.call({
                            method: 'interview.interview.custom.python.job_offer.create_employee',
                            args:{
                                fname: data.name,
                                gender: data.gender,
                                dob: data.date_of_birth,
                                doj: data.date_of_joining,
                                doc_name: frm.doc.name,
                            }
                        })
                        frappe.show_alert("Employee Created Successfully")
                        d.hide();
                    },
                    primary_action_label:__("Create")
                })
                d.show();
            })
        }
        if(frm.doc.employee_name){
            frm.remove_custom_button(__("Employee Creation"))
            frm.add_custom_button(__("Salary Structure Assignment"),function(){
                frappe.call({
                    method:'interview.interview.custom.python.job_offer.salary_structure_assignment',
                    args:{
                        doj: frm.doc.employee_joining_date,
                        emp_name: frm.doc.employee_name,
                        sal: frm.doc.salary_structure,
                    }
                })
                frappe.show_alert("Salary Structure Assignment created Successfully")
            },__("Create"))
            frm.add_custom_button(__("Leave Policy Assignment"),function(){
                var d = new frappe.ui.Dialog({
                    title:__("Leave Policy Assignment"),
                    fields:[
                        {
                            "label": "Leave Policy",
                            "fieldname": "leave_policy",
                            "fieldtype": "Link",
                            "reqd": 1,
                            "options": "Leave Policy",
                        },
                        {
                            "label": "Effective From",
                            "fieldname":'effective_from',
                            "fieldtype":'Date',
                            "reqd": 1,
                        },
                        {
                            "label": "Effective To",
                            "fieldname":'effective_to',
                            "fieldtype":'Date',
                            "reqd": 1,
                        }
                    ],
                    primary_action: function(){
                        var data = d.get_values();
                        frappe.call({
                            method: 'interview.interview.custom.python.job_offer.leave_policy_assignment',
                            args:{
                                leave_policy: data.leave_policy,
                                effective_from: data.effective_from,
                                effective_to: data.effective_to,
                                emp_name: frm.doc.employee_name,
                            }
                        })
                        frappe.show_alert("Leave Policy Assignment created Successfully")
                        d.hide();
                    },
                    primary_action_label:__("Create")
                })
                d.show();
            },__("Create"))
        }
    },
})