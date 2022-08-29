// Copyright (c) 2022, admin and contributors
// For license information, please see license.txt

frappe.ui.form.on('Job Interview', {
	refresh: function(frm){
		if(frm.doc.docstatus == 1 && frm.doc.status != "Rejected"){
			frm.add_custom_button(__("Interview Evaluation"),function(){
				frappe.call({
					method: 'interview.interview.doctype.job_interview.job_interview.create_interview_evaluation',
					args:{
						name : frm.doc.name
					},
					callback:function(r){
						var doc = frappe.model.sync(r.message)[0];
						frappe.set_route("Form",doc.doctype,doc.name)
					}
				})
			})
		}
		if(frm.doc.interview_evaluation_round == frm.doc.rounds.length){
			frm.remove_custom_button(__('Interview Evaluation'))
			if(frm.doc.status == "Selected"){
				frm.add_custom_button(__("Job Offer"),function(){
					frappe.call({
						method : 'interview.interview.doctype.job_interview.job_interview.create_job_offer',
						args :{
							job : frm.doc.job_applicant,
							app_name : frm.doc.applicant_name,
							desig : frm.doc.designation,
							job_interview: frm.doc.name,
						},
						callback(r){
							var doc = frappe.model.sync(r.message)[0];
							frappe.set_route("Form",doc.doctype,doc.name)
						}
					})
				})
			}
		}
		if(frm.doc.job_offer_name){
			frm.remove_custom_button(__("Job Offer"))
		}
	},
	job_applicant: function(frm){
		frappe.call({
			method:'interview.interview.doctype.job_interview.job_interview.validate_job_applicant',
			args:{
				job: frm.doc.job_applicant,
				name: frm.doc.applicant_name,
			},
		})
	}
});
frappe.ui.form.on('Rounds',{
	create_event: function(frm,cdt,cdn){
		let row = locals[cdt][cdn]
		if(! frm.doc.__unsaved){
			frappe.call({
				method: 'interview.interview.doctype.job_interview.job_interview.create_event',
				args : {
					sub : row.rounds,
					name: frm.doc.name,
				},
				callback: function(r){
					var doc = frappe.model.sync(r.message)[0];
						frappe.set_route("Form", doc.doctype, doc.name);
				}
			})
		}
	else{
		frappe.throw("Save the Document to Create Event")
	}
	},
})