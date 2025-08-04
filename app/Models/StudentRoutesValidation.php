<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentRoutesValidation extends Model
{
    protected $fillable = [
        'uploaded_file_id',
        'stu_autoid',
        'stu_lastname',
        'stu_firstname',
        'stu_loc_number',
        'stu_loc_streetname',
        'stu_loc_type',
        'stu_zcity_desc',
        'stu_zstatecountry_statecode',
        'stu_loc_mapzone',
        'stu_sch_code',
        'tripasgn_sch_code',
        'sch_name',
        'run_idx',
        'run_desc',
        'run_freq',
        'rte_id',
        'rte_desc',
        'stutrip_ztriptype_id',
        'stutrip_freqdisplay',
        'stop_idx',
        'loc_loc',
        'stopsrv_belltime',
        'stu_zgrades_descriptor',
        'ulivw_____',
        'ugeocode__',
        'billing___',
        'run_page__',
        'ustartdate',
        'stuneeds_need1',
        'stuneeds_need2',
        'stuneeds_need3',
        'stuneeds_need4',
        'stuneeds_need5',
        'stuneeds_need6',
        'stuneeds_need7',
        'stuneeds_need8',
        'stuneeds_need9',
        'stuneeds_need10',
        'stuothneeds_need5',
        'stuothneeds_need4',
        'stu_dateofbirth',
        'boces_____',
    ];

    protected $casts = [
        'stuneeds_need1' => 'boolean',
        'stuneeds_need2' => 'boolean',
        'stuneeds_need3' => 'boolean',
        'stuneeds_need4' => 'boolean',
        'stuneeds_need5' => 'boolean',
        'stuneeds_need6' => 'boolean',
        'stuneeds_need7' => 'boolean',
        'stuneeds_need8' => 'boolean',
        'stuneeds_need9' => 'boolean',
        'stuneeds_need10' => 'boolean',
        'stuothneeds_need5' => 'boolean',
        'stuothneeds_need4' => 'boolean',
    ];

    public function uploadedFile(): BelongsTo
    {
        return $this->belongsTo(UploadedFile::class);
    }
}
