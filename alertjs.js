define('alertjs', ['jquery'], function ($) {
    return {
        alertContainer: null,
        isVisible: false,
        direction: "ltr",
        prgressSequence: 0,
        normalDelay: 6000,

        init: function (alertContainerSelector, direction) {
            this.alertContainer = $(alertContainerSelector);
            this.direction = direction;
            if(this.alertContainer.length > 0){
                this.alertContainer.addClass(this.direction);
            }
            return this;
        },
        getRealProgressId: function () {
            return this.prgressSequence + 1;
        },
        alert: function (alertType, alertMessage, hasRealProgress) {
            var self = this;
            var realProgressId = 0;
            if (alertType && alertMessage) {
                if (!this.isVisible) {
                    this.isVisible = true;
                    this.alertContainer.show();
                }
                var alert = '<div class="alert ';
                if (hasRealProgress) {
                    realProgressId = this.getRealProgressId();
                    alert += 'real-progress real-progress-' + realProgressId;
                }
                alert += ' active ' + alertType + '">';
                alert += alertMessage;
                alert += '<div class="progress"></div>';
                alert += '</div>';
                this.alertContainer.append(alert);
                var activeAlert = this.alertContainer.find('.alert.active');
                activeAlert.removeClass('active');
                var alertProgress = activeAlert.find('.progress');
                var animationOpts = {opacity: 1};
                if(this.direction == 'ltr'){
                    animationOpts.right = 0;
                }else{
                    animationOpts.left = 0;
                }
                activeAlert.animate(animationOpts, 800, function () {
                    if (!hasRealProgress) {
                        alertProgress.animate({ width: '100%' }, self.normalDelay);
                        setTimeout(function () {
                            self.hideAlert(activeAlert);
                        }, self.normalDelay + 100);
                    }
                });
            }
            return realProgressId;
        },
        hideAlert: function (activeAlert, left) {
            var self = this;
            var animationOpts = {opacity: 1};
            if(this.direction == 'ltr'){
                animationOpts.right = '-600px';
            }else{
                animationOpts.left = '-600px';
            }
            activeAlert.animate(animationOpts, 800, function () {
                activeAlert.remove();
                if (!self.alertContainer.html()) {
                    self.alertContainer.hide();
                    self.isVisible = false;
                }
            });
        },
        updateRealProgress: function (progressId, percentage) {
            if (!isNaN(progressId) && !isNaN(percentage)) {
                var self = this;
                var realProgressAlert = self.alertContainer.find('.real-progress-' + progressId);
                if (realProgressAlert.length > 0) {
                    var realProgress = realProgressAlert.find('.progress');
                    if (realProgress.length > 0) {
                        realProgress.animate({ width: percentage + '%' }, 800, function () {
                            if (percentage == 100) {
                                self.hideAlert(realProgressAlert);
                            }
                        });
                    }
                }
            }
        }
    };
});