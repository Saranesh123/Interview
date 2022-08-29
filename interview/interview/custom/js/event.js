frappe.ui.form.on("Event",{
    after_save: function(frm){
        frappe.call({
            method: 'interview.interview.custom.python.event.update_ji',
            args:{
                subject : frm.doc.subject,
                event: frm.doc.name,
                date: frm.doc.starts_on,
                job:frm.doc.job_interview_name,
                round: frm.doc.round
            }
        })
    },
    refresh: function(frm){
        if(! frm.doc.__islocal && frm.doc.job_interview_name){
            frm.add_custom_button(__("Go to Job Interview"),() => {
                frappe.set_route("Form",'Job Interview',frm.doc.job_interview_name)
            })
        }
    },
})