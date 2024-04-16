/**
 * 
 */

$(document).ready(function() {
	$("#description").trumbowyg();
	$("#stateListTable").DataTable({
		"lengthMenu": [ 10, 25, 50, 75, 100 ],
		"ordering": false,
		stateSave: true
	});

	$("#districtListTable").DataTable({
		"lengthMenu": [ 10, 25, 50, 75, 100 ],
		"ordering": false,
		stateSave: true
	});

	$("#cityListTable").DataTable({
		"lengthMenu": [ 10, 25, 50, 75, 100 ],
		"ordering": false,
		stateSave: true
	});

	$("#categoryListTable").DataTable({
		"lengthMenu": [ 10, 25, 50, 75, 100 ],
		"ordering": false,
		stateSave: true
	});

	$("#subCategoryListTable").DataTable({
		"lengthMenu": [ 10, 25, 50, 75, 100 ],
		"ordering": false,
		stateSave: true
	});

	$("#productListTable").DataTable({
		"lengthMenu": [ 10, 25, 50, 75, 100 ],
		"ordering": false,
		stateSave: true
	});

	var requiredCheckboxes = $('.options :checkbox[required]');

	var servingCityCheckBoxes = $('.city-serving :checkbox[required]');

	requiredCheckboxes.on('click', function (){
		requiredCheckBoxes(requiredCheckboxes);
	});
	requiredCheckBoxes(requiredCheckboxes);

	$(document).on('click', '.city-serving :checkbox', function (){
		requiredCheckBoxes($('.city-serving :checkbox'));
	});
	requiredCheckBoxes($('.city-serving :checkbox'));

	function requiredCheckBoxes(requiredCheckboxes) {
		if (requiredCheckboxes.is(':checked')) {
			requiredCheckboxes.removeAttr('required');
			$('.custom-invalid-feedback').css("display","none");
		} else {
			requiredCheckboxes.attr('required', 'required');
			$('.custom-invalid-feedback').css("display","block");
		}
	}

//To execute same logic onload and onclick




	function selectCheckBoxes() {
		if ($("#selectAllCities").is(':checked')) {
			$(".servingCities:checkbox").prop("checked", true);
		} else {
			$(".servingCities:checkbox").prop("checked", false);
		}
	}

	$("#selectAllCities").on('click', function (){
		selectCheckBoxes();
	});
	console.log()

	$('.delete-book').on('click', function (){
		/*<![CDATA[*/
	    var path = /*[[@{/}]]*/'remove';
	    /*]]>*/
		
		var id=$(this).attr('id');
		
		bootbox.confirm({
			message: "Are you sure to remove this book? It can't be undone.",
			buttons: {
				cancel: {
					label:'<i class="fa fa-times"></i> Cancel'
				},
				confirm: {
					label:'<i class="fa fa-check"></i> Confirm'
				}
			},
			callback: function(confirmed) {
				if(confirmed) {
					$.post(path, {'id':id}, function(res) {
						location.reload();
					});
				}
			}
		});
	});
	
	
	
//	$('.checkboxBook').click(function () {
//        var id = $(this).attr('id');
//        if(this.checked){
//            bookIdList.push(id);
//        }
//        else {
//            bookIdList.splice(bookIdList.indexOf(id), 1);
//        }
//    })
	
	$('#deleteSelected').click(function() {
		var idList= $('.checkboxBook');
		var bookIdList=[];
		for (var i = 0; i < idList.length; i++) {
			if(idList[i].checked==true) {
				bookIdList.push(idList[i]['id'])
			}
		}
		
		console.log(bookIdList);
		
		/*<![CDATA[*/
	    var path = /*[[@{/}]]*/'removeList';
	    /*]]>*/
	    
	    bootbox.confirm({
			message: "Are you sure to remove all selected books? It can't be undone.",
			buttons: {
				cancel: {
					label:'<i class="fa fa-times"></i> Cancel'
				},
				confirm: {
					label:'<i class="fa fa-check"></i> Confirm'
				}
			},
			callback: function(confirmed) {
				if(confirmed) {
					$.ajax({
						type: 'POST',
						url: path,
						data: JSON.stringify(bookIdList),
						contentType: "application/json",
						success: function(res) {
							console.log(res); 
							location.reload()
							},
						error: function(res){
							console.log(res); 
							location.reload();
							}
					});
				}
			}
		});
	});
	
	$("#selectAllBooks").click(function() {
		if($(this).prop("checked")==true) {
			$(".checkboxBook").prop("checked",true);
		} else if ($(this).prop("checked")==false) {
			$(".checkboxBook").prop("checked",false);
		}
	})

	$("#stateFilter").on('change', function(){
		callDistrict();
	});

	$("#districtFilter").on('change', function(){
		callCity();
	});
	$("#categoryFilter").on('change', function(){
		callCategory();
	});
	$("#tourismFilter").on('change', function(){
		callTourism();
	});

	$("#cityStateSelect").on('change', function(){
		var id = $("#cityStateSelect").val();
		populateDistrict(id, "#cityDistrictSelect");
	});
	$("#stateSelect").on('change', function(){
		var id = $("#stateSelect").val();
		populateDistrict(id, "#districtSelect");
	});
	$("#districtSelect").on('change', function(){
		var id = $("#districtSelect").val();
		populateCity(id, "#citySelect");
	});

	$(".imagefile").on('change', function(){

		var input = $(this)[0];
		var imageElem = $(this).attr("imageElem");
		var component = $(this).attr("component");
		var cityId = $("#citySelect").val();
		var name = $("#componentName").val();
		var index = parseInt($(this).attr("index"))+1;

		var fileName = component+'_'+cityId+'_'+name+'_image_'+index+ $(this).val().match(/\..*$/);
		$('#input'+imageElem).val(fileName)
		$('#index'+imageElem).val(fileName);

		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				$('#display'+imageElem)
					.css({
						display: "block"
					})
				$('#delete'+imageElem)
					.css({
						display: "block"
					})
				$('#display'+imageElem)
					.attr('src', e.target.result);

			};

			reader.readAsDataURL(input.files[0]);
		}
	})

	$(".deleteImage").on('click', function(){

		var imageElem = $(this).attr("imageElem");

		$('#imageIndex'+imageElem).remove();

		$('#display'+imageElem)
			.attr('src', '');
		$('#display'+imageElem)
			.css({
				display: "none"
			})

		$('#delete'+imageElem)
			.css({
				display: "none"
			})
		$('#file'+imageElem)
			.val("")

		$('#title'+imageElem)
			.val("")
		$('#desc'+imageElem)
			.val("")

		$('#input'+imageElem).val("")

	})

});

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
	'use strict'

	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	var forms = document.querySelectorAll('.needs-validation')

	// Loop over them and prevent submission
	Array.prototype.slice.call(forms)
		.forEach(function (form) {
			form.addEventListener('submit', function (event) {
				if (!form.checkValidity()) {
					event.preventDefault()
					event.stopPropagation()
				}

				form.classList.add('was-validated')
			}, false)
		})
})()

function callDistrict(){
	$("#stateFilterForm").submit();
}
function callCity(){
	$("#districtFilterForm").submit();
}
function callCategory(){
	$("#categoryFilterForm").submit();
}

function callTourism(){
	$("#tourismFilterForm").submit();
}

function populateDistrict(id, elementId){
	$.ajax({

		type: "GET",
		url: "backend/districtAjList?stateId="+id,
		success: function(data) {
			console.log(data);
			var htmlOptions = [];
			if( data.length ){
				htmlOptions[0]  = '<option value="">Please Select the District</option>';
				for( item in data ) {
					html = '<option value="' + data[item].id + '">' + data[item].name + '</option>';
					htmlOptions[htmlOptions.length] = html;
				}

				// here you will empty the pre-existing data from you selectbox and will append the htmlOption created in the loop result
				$(elementId).empty().append( htmlOptions.join('') );
			}
		},
		error: function(error) {
			alert(error.responseJSON.message);
		}
	})
}

function populateCity(id, elementId){
	$.ajax({

		type: "GET",
		url: "backend/cityAjList?districtId="+id,
		success: function(data) {
			console.log(data);
			var htmlOptions = [];
			var selectOptions = [];
			if( data.length ){
				htmlOptions[0]  = '<option value="">Please Select the City</option>';
				//for( item in data ) {
				for( var item=0; item<data.length; item++) {
					var validationHtml = '';
					var html1 = '';
					var html = '';
					if((item%4)==0){
						html1 = '<div class="row"></div>'
					}
					console.log("my =="+item+" the size  = "+data.length)
					if(item==(data.length-1)){
						console.log("I got added");
						validationHtml = '<div class="custom-invalid-feedback">Please Select atleast one city</div>';
					}
					html = html1+'<div class="area-serving"><input type="checkbox" name="servingCities" value="'+data[item].id+'" class="me-2 servingCities" required >'+data[item].name+'</input>'+validationHtml+'</div>';
					htmlOptions[htmlOptions.length] = html;
				}
				//htmlOptions[htmlOptions.length] ='<div className="invalid-feedback">Please Select atleast one city</div>';

				for( item in data ) {
					html = '<option value="' + data[item].id + '">' + data[item].name + '</option>';
					selectOptions[selectOptions.length] = html;
				}

				// here you will empty the pre-existing data from you selectbox and will append the htmlOption created in the loop result
				$(elementId).empty().append( selectOptions.join('') );
				$(".city-serving").html( htmlOptions.join('') );
			}
		},
		error: function(error) {
			alert(error.responseJSON.message);
		}
	})
}