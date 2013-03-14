<?php

/**
 * triggers_WizardSave.php
 *
 * ProcessMaker Open Source Edition
 * Copyright (C) 2004 - 2008 Colosa Inc.23
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * For more information, contact Colosa Inc, 2566 Le Jeune Rd.,
 * Coral Gables, FL, 33134, USA, or email info@colosa.com.
 */
if (($RBAC_Response = $RBAC->userCanAccess("PM_FACTORY")) != 1) {
    return $RBAC_Response;
}
require_once ('classes/model/Triggers.php');
$oTrigger = new Triggers();

G::LoadClass('processMap');
$oProcessMap = new processMap(new DBConnection());

$aDataTriggers = $_POST;

$aInfoFunction = explode(",", $aDataTriggers['ALLFUNCTION']);
$aInfoFunctionType = explode(",", $aDataTriggers['ALLFUNCTION_TYPE']);

$sPMfunction = "
/***************************************************
 *
 * Generated by ProcessMaker Trigger Wizard
 * Library: " . $aDataTriggers['LIBRARY_NAME'] . "
 * Method: " . $aDataTriggers['PMFUNTION_LABEL'] . "
 * Date: " . date("Y-m-d H:i:s") . "
 *
 * ProcessMaker " . date("Y") . "
 *
 ****************************************************/

";

$methodParamsFinal = array();
//Generate params to send
$i = 0;
foreach ($aInfoFunction as $k => $v) {
    if ($v != '') {

        $sOptionTrigger = trim(str_replace("$", "", $v));
        if (strstr($sOptionTrigger, "=")) {
            $aOptionParameters = explode("=", $sOptionTrigger);
            $sOptionTrigger = trim($aOptionParameters[0]);
        }
        if ($aDataTriggers[$sOptionTrigger] != '') {

            if ((strstr($aDataTriggers[$sOptionTrigger], "@@"))) {
                $option = trim($aDataTriggers[$sOptionTrigger]);
            } else {

                $aDataTriggers[$sOptionTrigger] = (strstr($aDataTriggers[$sOptionTrigger], 'array')) ? str_replace("'", '"', $aDataTriggers[$sOptionTrigger]) : str_replace("'", "\'", $aDataTriggers[$sOptionTrigger]);
                switch (trim($aInfoFunctionType[$i])) {
                    case 'boolean':
                        $option = $aDataTriggers[$sOptionTrigger];
                        break;
                    case 'int':
                        $option = intval($aDataTriggers[$sOptionTrigger]);
                        break;
                    case 'float':
                    case 'real':
                    case 'double':
                        $option = floatval($aDataTriggers[$sOptionTrigger]);
                        break;
                    default:
                        $option = (is_numeric($aDataTriggers[$sOptionTrigger]) || is_bool($aDataTriggers[$sOptionTrigger]) ) ? trim($aDataTriggers[$sOptionTrigger]) : (strstr($aDataTriggers[$sOptionTrigger], "array")) ? trim($aDataTriggers[$sOptionTrigger]) : "'" . trim($aDataTriggers[$sOptionTrigger]) . "'";
                        break;
                }
            }
        } else {
            $option = "''";
        }
        $methodParamsFinal[] = $option;
    }
    $i++;
}
//G::pr($methodParamsFinal);die;
$sPMfunction .= (isset($aDataTriggers['TRI_ANSWER']) && $aDataTriggers['TRI_ANSWER'] != '') ? $aDataTriggers['TRI_ANSWER'] . " = " : "";
$sPMfunction .= $aDataTriggers['PMFUNTION_NAME'] . " (" . implode(",", $methodParamsFinal) . ");";

//Create Trigger
$aDataTriggers['TRI_WEBBOT'] = $sPMfunction;
$aDataTriggersParams = array();
$aDataTriggersParams['hash'] = md5($sPMfunction);
$aDataTriggersParams['params'] = $aDataTriggers;

$aDataTriggers['TRI_PARAM'] = serialize($aDataTriggersParams);
$oTrigger->create($aDataTriggers);

//Update Info
$aDataTriggers['TRI_UID'] = $oTrigger->getTriUid();
$oTrigger->update($aDataTriggers);

//Update Trigger Array
$oProcessMap->triggersList($aDataTriggers['PRO_UID']);

