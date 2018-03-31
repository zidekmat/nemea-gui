/**
 * Some code was used from https://github.com/sysrepo/sysrepo/blob/master/examples/oper_data_example.c
 *
 * Authors of that code are Rastislav Szabo <raszabo@cisco.com>, Lukas Macko <lmacko@cisco.com>
 * and copyright goes to Cisco Systems, Inc. 2016
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include <stdio.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <string.h>
#include <inttypes.h>

#include <sysrepo.h>
#include <sysrepo/values.h>
#include <sysrepo/xpath.h>

volatile int exit_application = 0;

#define NULLP_TEST_AND_FREE(pointer) do { \
   if ((pointer) != NULL) { \
      free((pointer)); \
      (pointer) = NULL; \
   } \
} while (0);

#define NO_MEM_ERR do { \
   printf("Failed to allocate memory in %s %s:%d\n", \
         __FILE__, __func__,  __LINE__); \
} while (0);

static void sigint_handler(int signum)
{
    exit_application = 1;
}

static int set_new_sr_val(sr_val_t *new_sr_val,
                          const char *stat_xpath,
                          const char *stat_leaf_name,
                          sr_type_t val_type,
                          void *val_data)
{
   int rc;
   char *stat_leaf_xpath = NULL;
   uint64_t stat_xpath_len = strlen(stat_xpath) + strlen(stat_leaf_name) + 2;

   stat_leaf_xpath = (char *) calloc(1, sizeof(char) * (stat_xpath_len));
   if (stat_leaf_xpath == NULL) {
      NO_MEM_ERR
      goto err_cleanup;
   }

   sprintf(stat_leaf_xpath, "%s/%s", stat_xpath, stat_leaf_name);
   rc = sr_val_set_xpath(new_sr_val, stat_leaf_xpath);
   if (rc != 0) {
      printf("Failed to set output stats value xpath=%s\n", stat_leaf_xpath);
      goto err_cleanup;
   }

   switch (val_type) {
      case SR_BOOL_T:
         new_sr_val->type = SR_BOOL_T;
         new_sr_val->data.bool_val = *(bool *)  val_data;
         break;
      case SR_UINT8_T:
         new_sr_val->type = SR_UINT8_T;
         new_sr_val->data.uint8_val = *(uint8_t *) val_data;
         break;
      case SR_UINT64_T:
         new_sr_val->type = SR_UINT64_T;
         new_sr_val->data.uint64_val = *(uint64_t *) val_data;
         break;

      default:
         break;
   }

   return 0;

err_cleanup:
   NULLP_TEST_AND_FREE(stat_leaf_xpath)
   printf("set_new_sr_val failed\n");

   return -1;
}

int interface_get_stats_cb(const char *xpath,
                           sr_val_t **values,
                           size_t *values_cnt,
                           void *private_ctx)
{
   int rc;
   uint8_t vals_cnt;
   sr_val_t *new_vals = NULL;
      FILE * f = fopen("/tmp/log2", "a");
   fprintf(f, "RECEIVED REQUEST\n");
   fclose(f);

   //if (ifc->direction == NS_IF_DIR_IN) {
/*      vals_cnt = 2;

      rc = sr_new_values(vals_cnt, &new_vals);
      if (rc != SR_ERR_OK) {
         printf("Failed create stats output values: %s", sr_strerror(rc));
         goto err_cleanup;
      }

      uint64_t recv_msg_cnt = 123;
      rc = set_new_sr_val(&new_vals[0], xpath, "recv-msg-cnt", SR_UINT64_T,
                          &recv_msg_cnt);
      if (rc != 0) {
         printf("Setting node value for /recv-msg-cnt failed\n");
         goto err_cleanup;
      }

      uint64_t recv_buff_cnt = 124;
      rc = set_new_sr_val(&new_vals[1], xpath, "recv-buff-cnt", SR_UINT64_T,
                          &recv_buff_cnt);
      if (rc != 0) {
         printf("Setting node value for /recv-buff-cnt failed\n");
         goto err_cleanup;
      }*/
   //} else { // ifc->direction == NS_IF_DIR_OUT
      vals_cnt = 4;

      rc = sr_new_values(vals_cnt, &new_vals);
      if (rc != SR_ERR_OK) {
         printf("Failed create stats output values: %s\n", sr_strerror(rc));
         goto err_cleanup;
      }

      uint64_t sent_msg_cnt = 123;
      rc = set_new_sr_val(&new_vals[0], xpath, "sent-msg-cnt", SR_UINT64_T,
                          &sent_msg_cnt);
      if (rc != 0) {
         printf("Setting node value for /sent-msg-cnt failed\n");
         goto err_cleanup;
      }

      uint64_t sent_buff_cnt = 124;
      rc = set_new_sr_val(&new_vals[1], xpath, "sent-buff-cnt", SR_UINT64_T,
                          &sent_buff_cnt);
      if (rc != 0) {
         printf("Setting node value for /sent-buff-cnt failed\n");
         goto err_cleanup;
      }

      uint64_t dropped_msg_cnt =134;
      rc = set_new_sr_val(&new_vals[2], xpath, "dropped-msg-cnt", SR_UINT64_T,
                          &dropped_msg_cnt);
      if (rc != 0) {
         printf("Setting node value for /dropped-msg-cnt failed\n");
         goto err_cleanup;
      }

      uint64_t autoflush_cnt = 125;
      rc = set_new_sr_val(&new_vals[3], xpath, "autoflush-cnt", SR_UINT64_T,
                          &autoflush_cnt);
      if (rc != 0) {
         printf("Setting node value for /autoflush-cnt failed\n");
         goto err_cleanup;
      }

   *values_cnt = vals_cnt;
   *values = new_vals;

   return SR_ERR_OK;

err_cleanup:
   if (new_vals != NULL) {
      sr_free_values(new_vals, *values_cnt);
   }

   printf("Retrieving stats for xpath=%s failed.\n", xpath);
   return rc;
}

int inst_get_stats_cb(const char *xpath,
                      sr_val_t **values,
                      size_t *values_cnt,
                      void *private_ctx)
{

   int rc;
   uint8_t vals_cnt = 6;
   sr_val_t *new_vals = NULL;

   rc = sr_new_values(vals_cnt, &new_vals);
   if (rc != SR_ERR_OK) {
      printf("Failed create stats output values: %s\n", sr_strerror(rc));
      goto err_cleanup;
   }

   bool running = true;
   rc = set_new_sr_val(&new_vals[0], xpath, "running", SR_BOOL_T, &running);
   if (rc != 0) {
      printf("Setting node value for /running failed\n");
      goto err_cleanup;
   }

   uint8_t restarts_cnt = 2;
   rc = set_new_sr_val(&new_vals[1], xpath, "restart-counter", SR_UINT8_T,
                       &restarts_cnt);
   if (rc != 0) {
      printf("Setting node value for /restart-counter failed\n");
      goto err_cleanup;
   }

   uint64_t last_cpu_umode = 1234;
   rc = set_new_sr_val(&new_vals[2], xpath, "cpu-user", SR_UINT64_T,
                       &last_cpu_umode);
   if (rc != 0) {
      printf("Setting node value for /cpu-user failed\n");
      goto err_cleanup;
   }

   uint64_t last_cpu_kmode = 1235;
   rc = set_new_sr_val(&new_vals[3], xpath, "cpu-kern", SR_UINT64_T,
                       &last_cpu_kmode);
   if (rc != 0) {
      printf("Setting node value for /cpu-kern failed\n");
      goto err_cleanup;
   }

   uint64_t mem_vms = 1234;
   rc = set_new_sr_val(&new_vals[4], xpath, "mem-vms", SR_UINT64_T, &mem_vms);
   if (rc != 0) {
      printf("Setting node value for /mem-vms failed\n");
      goto err_cleanup;
   }

   uint64_t mem_rss = 1234;
   rc = set_new_sr_val(&new_vals[5], xpath, "mem-rss", SR_UINT64_T, &mem_rss);
   if (rc != 0) {
      printf("Setting node value for /mem-rss failed\n");
      goto err_cleanup;
   }

   *values_cnt = vals_cnt;
   *values = new_vals;
   return SR_ERR_OK;

err_cleanup:
   if (new_vals != NULL) {
      sr_free_values(new_vals, *values_cnt);
   }

   printf("Retrieving stats for xpath=%s failed.\n", xpath);

   return rc;
}

int
run_config_change_cb(sr_session_ctx_t *sess,
                     const char *smn,
                     sr_notif_event_t evnt,
                     void *priv_ctx)
{
   return SR_ERR_OK;
}

int main(int argc, char **argv)
{
    // NOTICE
    // This won't work if there are no data inside startup DS
    sr_conn_ctx_t *connection = NULL;
    sr_session_ctx_t *session = NULL;
    sr_subscription_ctx_t *subscription = NULL;
    int rc = SR_ERR_OK;

    /* connect to sysrepo */
    rc = sr_connect("stats_provider.c", SR_CONN_DEFAULT, &connection);
    if (SR_ERR_OK != rc) {
        fprintf(stderr, "Error by sr_connect: %s\n", sr_strerror(rc));
        goto cleanup;
    }

    /* start session */
    rc = sr_session_start(connection, SR_DS_RUNNING, SR_SESS_DEFAULT, &session);
    if (SR_ERR_OK != rc) {
        fprintf(stderr, "Error by sr_session_start: %s\n", sr_strerror(rc));
        goto cleanup;
    }

    /* subscribe for providing operational data */
    rc = sr_dp_get_items_subscribe(session, "/nemea-test-1:supervisor/module/stats", inst_get_stats_cb, NULL,
                                   SR_SUBSCR_DEFAULT, &subscription);
    if (SR_ERR_OK != rc) {
        fprintf(stderr, "Error by sr_dp_get_items_subscribe: %s\n", sr_strerror(rc));
        goto cleanup;
    }
    rc = sr_dp_get_items_subscribe(session, "/nemea-test-1:supervisor/module/interface/stats", interface_get_stats_cb, NULL,
            SR_SUBSCR_CTX_REUSE, &subscription);
    if (SR_ERR_OK != rc) {
        fprintf(stderr, "Error by sr_dp_get_items_subscribe2: %s\n", sr_strerror(rc));
        goto cleanup;
    }


    //printf("\n\n ========== SUBSCRIBED FOR PROVIDING OPER DATA ==========\n\n");

    /* loop until ctrl-c is pressed / SIGINT is received */
    signal(SIGINT, sigint_handler);
    signal(SIGPIPE, SIG_IGN);
    while (!exit_application) {
        sleep(1000);  /* or do some more useful work... */
    }

    printf("Application exit requested, exiting.\n");

cleanup:
    if (NULL != subscription) {
        sr_unsubscribe(session, subscription);
    }
    if (NULL != session) {
        sr_session_stop(session);
    }
    if (NULL != connection) {
        sr_disconnect(connection);
    }

    return rc;
}

