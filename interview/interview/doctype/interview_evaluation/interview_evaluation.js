// Copyright (c) 2022, admin and contributors
// For license information, please see license.txt

frappe.ui.form.on('Interview Evaluation', {
	onload: function(frm){
		frappe.call({
			method:'interview.interview.doctype.interview_evaluation.interview_evaluation.criteria',
			callback(r){
				frm.clear_table('evaluation');
				r.message.forEach((d)=>{
					var row = frm.add_child('evaluation');
					row.criteria = d.criteria
				})
				refresh_field('evaluation')
			}
		})
		frm.set_query('panel_member',function(doc){
			return{
				query : 'interview.interview.doctype.interview_evaluation.interview_evaluation.get_emp_filter',
				filters:{
					job_interview : frm.doc.job_interview_name
				}
			}
		})
	},
	refresh: function(frm){
		frm.set_value('date',frappe.datetime.nowdate())
		if(! frm.doc.__islocal && frm.doc.job_interview_name){
			frm.add_custom_button(__("Go to Job Interview"),() => {
                frappe.set_route("Form",'Job Interview',frm.doc.job_interview_name)
            })
		}
	}
});